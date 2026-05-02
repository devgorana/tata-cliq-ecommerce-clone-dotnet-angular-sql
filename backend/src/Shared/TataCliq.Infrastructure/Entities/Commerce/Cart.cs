using TataCliq.Infrastructure.Entities.Auth;
using TataCliq.SharedKernel.Domain;

namespace TataCliq.Infrastructure.Entities.Commerce;

public class Cart : BaseEntity<Guid>
{
    public Guid UserId { get; set; }

    public ApplicationUser User { get; set; } = null!;
    public ICollection<CartItem> Items { get; set; } = [];
}
