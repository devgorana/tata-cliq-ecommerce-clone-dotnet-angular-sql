// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  Tata CLiQ Fashion — Azure Infrastructure (Bicep)                          ║
// ║                                                                              ║
// ║  Implements:                                                                 ║
// ║   ENH-INFRA-001  TLS 1.3 floor on App Services + SQL Server                ║
// ║   ENH-INFRA-003  Diagnostic Settings → Log Analytics for all resources      ║
// ║   ENH-INFRA-004  FinOps tagging: Environment / CostCenter / Owner           ║
// ║   ENH-INFRA-011  Key Vault firewall + private endpoint (no public KV access) ║
// ║                                                                              ║
// ║  Deploy:                                                                     ║
// ║    az deployment sub create \                                                ║
// ║      --location eastus \                                                     ║
// ║      --template-file infra/bicep/main.bicep \                               ║
// ║      --parameters @infra/bicep/parameters/production.bicepparam             ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

targetScope = 'subscription'

// ── ENH-INFRA-004: FinOps parameters ──────────────────────────────────────────
@description('Deployment environment name (production | staging | development).')
param environmentName string = 'production'

@description('FinOps cost centre for billing allocation.')
param costCenter string = 'TATACLIQ-FASHION-ECOMM'

@description('Owner email or team alias.')
param owner string = 'platform-team@tatacliq.com'

// ── Deployment parameters ─────────────────────────────────────────────────────
@description('Primary Azure region.')
param location string = 'eastus'

@description('DR region for geo-redundant resources.')
param drLocation string = 'centralindia'

@description('App Service Plan SKU (P2v3 recommended for production).')
param appServicePlanSku string = 'P2v3'

@description('App Service Plan instance count.')
@minValue(1)
@maxValue(10)
param appServicePlanCapacity int = 2

@description('Resource ID of an existing Log Analytics workspace (ENH-INFRA-003).')
param logAnalyticsWorkspaceId string

@description('Subnet resource ID for Key Vault private endpoint (ENH-INFRA-011).')
param keyVaultPrivateEndpointSubnetId string

@description('AAD object IDs that should receive Key Vault Secrets User role.')
param allowedKeyVaultObjectIds array = []

@description('SQL Server admin login.')
param sqlAdminLogin string = 'tatacliqadmin'

@secure()
@description('SQL Server admin password.')
param sqlAdminPassword string

// ── Derived names ─────────────────────────────────────────────────────────────
var suffix       = uniqueString(subscription().subscriptionId, environmentName)
var rgName       = 'rg-tatacliq-${environmentName}'
var kvName       = 'kv-tatacliq-${take(suffix, 8)}'
var sqlName      = 'sql-tatacliq-${take(suffix, 8)}'
var planName     = 'plan-tatacliq-${environmentName}'

// ── Service names (one App Service per micro-service) ─────────────────────────
var services = [
  { name: 'app-tatacliq-auth',     image: 'REPLACE_ACR/tatacliq.auth.api:latest'     }
  { name: 'app-tatacliq-catalog',  image: 'REPLACE_ACR/tatacliq.catalog.api:latest'  }
  { name: 'app-tatacliq-order',    image: 'REPLACE_ACR/tatacliq.order.api:latest'    }
  { name: 'app-tatacliq-cart',     image: 'REPLACE_ACR/tatacliq.cart.api:latest'     }
  { name: 'app-tatacliq-user',     image: 'REPLACE_ACR/tatacliq.user.api:latest'     }
  { name: 'app-tatacliq-seller',   image: 'REPLACE_ACR/tatacliq.seller.api:latest'   }
  { name: 'app-tatacliq-admin',    image: 'REPLACE_ACR/tatacliq.admin.api:latest'    }
  { name: 'app-tatacliq-gateway',  image: 'REPLACE_ACR/tatacliq.gateway.api:latest'  }
  { name: 'app-tatacliq-media',    image: 'REPLACE_ACR/tatacliq.media.api:latest'    }
]

// ── FinOps tag object (reused across all modules) ─────────────────────────────
var commonTags = {
  Environment: environmentName
  CostCenter:  costCenter
  Owner:       owner
  ManagedBy:   'Bicep'
}

// ── Resource Group ────────────────────────────────────────────────────────────
resource rg 'Microsoft.Resources/resourceGroups@2023-07-01' = {
  name:     rgName
  location: location
  tags:     commonTags
}

// ── App Service Plan ──────────────────────────────────────────────────────────
module appServicePlan 'modules/app-service-plan.bicep' = {
  name:  'app-service-plan'
  scope: rg
  params: {
    planName:        planName
    location:        location
    sku:             appServicePlanSku
    capacity:        appServicePlanCapacity
    environmentName: environmentName
    costCenter:      costCenter
    owner:           owner
  }
}

// ── App Services (one per micro-service) ─────────────────────────────────────
@batchSize(3)
module appServices 'modules/app-service.bicep' = [for svc in services: {
  name:  'app-service-${svc.name}'
  scope: rg
  params: {
    appServiceName:          svc.name
    appServicePlanId:        appServicePlan.outputs.planId
    dockerImage:             svc.image
    location:                location
    logAnalyticsWorkspaceId: logAnalyticsWorkspaceId
    environmentName:         environmentName
    costCenter:              costCenter
    owner:                   owner
  }
}]

// ── Key Vault (ENH-INFRA-011) ─────────────────────────────────────────────────
module keyVault 'modules/keyvault.bicep' = {
  name:  'key-vault'
  scope: rg
  params: {
    keyVaultName:              kvName
    location:                  location
    logAnalyticsWorkspaceId:   logAnalyticsWorkspaceId
    privateEndpointSubnetId:   keyVaultPrivateEndpointSubnetId
    allowedObjectIds:          allowedKeyVaultObjectIds
    environmentName:           environmentName
    costCenter:                costCenter
    owner:                     owner
  }
}

// ── SQL Server (ENH-INFRA-001 TLS 1.3) ────────────────────────────────────────
module sqlServer 'modules/sql-server.bicep' = {
  name:  'sql-server'
  scope: rg
  params: {
    sqlServerName:           sqlName
    location:                location
    adminLogin:              sqlAdminLogin
    adminPassword:           sqlAdminPassword
    logAnalyticsWorkspaceId: logAnalyticsWorkspaceId
    environmentName:         environmentName
    costCenter:              costCenter
    owner:                   owner
  }
}

// ── DR Resource Group (Central India) — ENH-INFRA-005 ────────────────────────
resource drRg 'Microsoft.Resources/resourceGroups@2023-07-01' = {
  name:     'rg-tatacliq-${environmentName}-dr'
  location: drLocation
  tags:     union(commonTags, { DRRole: 'Secondary', Region: drLocation })
}

// ── SQL Geo-Replication (Active Geo-Replication → Central India) — ENH-INFRA-005 ──
module sqlGeoReplication 'modules/sql-geo-replication.bicep' = {
  name:  'sql-geo-replication'
  scope: drRg
  params: {
    primarySqlServerName:    sqlName
    secondarySqlServerName:  '${sqlName}-dr'
    databaseName:            'TataCliqDb'
    drLocation:              drLocation
    adminLogin:              sqlAdminLogin
    adminPassword:           sqlAdminPassword
    logAnalyticsWorkspaceId: logAnalyticsWorkspaceId
    environmentName:         environmentName
    costCenter:              costCenter
    owner:                   owner
  }
  dependsOn: [ sqlServer ]
}

// ── Outputs ───────────────────────────────────────────────────────────────────
output resourceGroupName         string = rg.name
output keyVaultUri               string = keyVault.outputs.keyVaultUri
output sqlServerFqdn             string = sqlServer.outputs.sqlServerFqdn
output drResourceGroupName       string = drRg.name
output drSqlServerFqdn           string = sqlGeoReplication.outputs.secondarySqlServerFqdn
