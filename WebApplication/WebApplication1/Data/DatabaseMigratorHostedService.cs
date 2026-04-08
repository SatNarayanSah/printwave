using Microsoft.EntityFrameworkCore;

namespace WebApplication1.Data
{
    public sealed class DatabaseMigratorHostedService : IHostedService
    {
        private readonly IServiceProvider serviceProvider;
        private readonly ILogger<DatabaseMigratorHostedService> logger;

        public DatabaseMigratorHostedService(
            IServiceProvider serviceProvider,
            ILogger<DatabaseMigratorHostedService> logger)
        {
            this.serviceProvider = serviceProvider;
            this.logger = logger;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            using var scope = serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<MyDbContext>();

            logger.LogInformation("Applying EF Core migrations...");
            await dbContext.Database.MigrateAsync(cancellationToken);
            logger.LogInformation("EF Core migrations applied.");
        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    }
}
