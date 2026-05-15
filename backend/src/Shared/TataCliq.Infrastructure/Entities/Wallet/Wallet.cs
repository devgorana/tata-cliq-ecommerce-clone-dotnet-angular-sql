using TataCliq.SharedKernel.Domain;

namespace TataCliq.Infrastructure.Entities.Wallet;

public class Wallet : BaseEntity<Guid>
{
    public Guid UserId { get; set; }
    public decimal Balance { get; set; } = 0m;
    public string Currency { get; set; } = "INR";

    public ICollection<WalletTransaction> Transactions { get; set; } = [];
}
