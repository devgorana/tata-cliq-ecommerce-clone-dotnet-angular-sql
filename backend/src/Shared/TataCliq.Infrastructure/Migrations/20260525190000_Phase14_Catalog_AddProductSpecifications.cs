using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TataCliq.Infrastructure.Migrations;

/// <summary>
/// ENH-CAT-010 — JSON Column Persisted Computed Index (SpecificationsJson).
/// TSD §6 / PC-002
///
/// Adds to [catalog].[Products]:
///   SpecificationsJson  nvarchar(max) NULL
///     → stores free-form product specifications as a JSON object
///       e.g. {"material":"100% Cotton","fit":"Slim Fit","pattern":"Solid"}
///
///   SpecMaterial  AS (CAST(JSON_VALUE(SpecificationsJson, '$.material') AS nvarchar(200))) PERSISTED
///     → SQL Server persisted computed column: extracts the 'material' key
///       from the JSON blob and stores it physically on disk.
///       PERSISTED means the value is pre-computed at write time, making it
///       indexable without per-row JSON parsing at query time.
///
///   IX_Products_SpecMaterial  ON (SpecMaterial) WHERE SpecMaterial IS NOT NULL
///     → Filtered non-clustered index: allows O(log n) seeks for
///       WHERE SpecMaterial = '100% Cotton' without scanning every row.
///       The filter avoids index entries for products lacking a material spec.
/// </summary>
public partial class Phase14_Catalog_AddProductSpecifications : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // ── Step 1: add the raw JSON storage column ───────────────────────────
        migrationBuilder.AddColumn<string>(
            name: "SpecificationsJson",
            schema: "catalog",
            table: "Products",
            type: "nvarchar(max)",
            nullable: true);

        // ── Step 2: add the persisted computed column ─────────────────────────
        // EF Core migrations do not support computed columns via AddColumn;
        // use raw SQL so we can specify PERSISTED which is required for indexing.
        migrationBuilder.Sql("""
            ALTER TABLE [catalog].[Products]
            ADD [SpecMaterial]
                AS (CAST(JSON_VALUE([SpecificationsJson], '$.material') AS nvarchar(200)))
                PERSISTED;
            """);

        // ── Step 3: filtered index on the persisted column ────────────────────
        // WHERE clause keeps the index selective: only rows WITH a material value
        // are indexed, saving space and maintenance overhead for products that
        // don't have a material specification.
        migrationBuilder.Sql("""
            CREATE NONCLUSTERED INDEX [IX_Products_SpecMaterial]
            ON [catalog].[Products] ([SpecMaterial])
            WHERE [SpecMaterial] IS NOT NULL;
            """);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        // Must drop index before dropping the computed column it references
        migrationBuilder.Sql(
            "DROP INDEX IF EXISTS [IX_Products_SpecMaterial] ON [catalog].[Products];");

        migrationBuilder.Sql(
            "ALTER TABLE [catalog].[Products] DROP COLUMN [SpecMaterial];");

        migrationBuilder.DropColumn(
            name: "SpecificationsJson",
            schema: "catalog",
            table: "Products");
    }
}
