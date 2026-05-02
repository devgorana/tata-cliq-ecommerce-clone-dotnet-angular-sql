using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace TataCliq.Infrastructure.Persistence;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();

        // Design-time connection string — only used for migration scaffolding, not runtime
        optionsBuilder.UseSqlServer(
            "Server=localhost,1433;Database=TataCliqDb;User Id=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True;",
            sql => sql.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName));

        optionsBuilder.AddInterceptors(new SaveChangesAuditInterceptor());

        return new AppDbContext(optionsBuilder.Options);
    }
}
