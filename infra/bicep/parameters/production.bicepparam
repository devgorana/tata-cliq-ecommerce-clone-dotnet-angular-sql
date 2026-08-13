// ENH-INFRA-001/003/004/011 — Production parameter file for Tata CLiQ Azure deployment.
// Deploy with: az deployment sub create --location eastus --template-file ../main.bicep --parameters @production.bicepparam

using '../main.bicep'

// ── Environment & FinOps tags (ENH-INFRA-004) ──────────────────────────────
param environmentName        = 'production'
param costCenter             = 'TATACLIQ-FASHION-ECOMM'
param owner                  = 'platform-team@tatacliq.com'

// ── Location ────────────────────────────────────────────────────────────────
param location               = 'eastus'
param drLocation             = 'centralindia'

// ── App Service Plan ────────────────────────────────────────────────────────
param appServicePlanSku      = 'P2v3'
param appServicePlanCapacity = 2

// ── Log Analytics (ENH-INFRA-003) ───────────────────────────────────────────
param logAnalyticsWorkspaceId = '/subscriptions/REPLACE_SUBSCRIPTION_ID/resourceGroups/REPLACE_RG/providers/Microsoft.OperationalInsights/workspaces/REPLACE_WORKSPACE'

// ── Key Vault (ENH-INFRA-011) ────────────────────────────────────────────────
param keyVaultPrivateEndpointSubnetId = '/subscriptions/REPLACE_SUBSCRIPTION_ID/resourceGroups/REPLACE_RG/providers/Microsoft.Network/virtualNetworks/REPLACE_VNET/subnets/REPLACE_SUBNET'
param allowedKeyVaultObjectIds        = []

// ── SQL Server ───────────────────────────────────────────────────────────────
param sqlAdminLogin          = 'tatacliqadmin'
param sqlAdminPassword       = 'REPLACE_WITH_SECURE_PASSWORD_FROM_KV'
