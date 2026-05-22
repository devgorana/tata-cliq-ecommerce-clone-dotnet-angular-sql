using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TataCliq.Order.API.Services;

namespace TataCliq.Order.API.Controllers;

[ApiController]
[Route("api/v1/checkout")]
[Authorize]
public sealed class CheckoutController(IPaymentOptionsService paymentOptions) : ControllerBase
{
    /// <summary>
    /// ENH-CHKOUT-003 — Returns available payment methods for a given cart total.
    /// COD is excluded from the response when cartTotal &gt; ₹50,000 (TC-PAY-BVA-002).
    /// </summary>
    [HttpGet("payment-options")]
    public IActionResult GetPaymentOptions([FromQuery] decimal cartTotal)
    {
        if (cartTotal < 0)
            return BadRequest(new { message = "cartTotal must be non-negative." });

        var options = paymentOptions.GetOptions(cartTotal);
        return Ok(options);
    }
}
