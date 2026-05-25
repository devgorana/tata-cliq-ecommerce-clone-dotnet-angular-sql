using Microsoft.AspNetCore.Mvc;
using TataCliq.Catalog.API.Services;

namespace TataCliq.Catalog.API.Controllers;

[ApiController]
[Route("api/v1/payment")]
public sealed class EmiController(IEmiCalculatorService emiService) : ControllerBase
{
    /// <summary>
    /// ENH-PDP-002 — Returns bank-wise EMI options for a given order amount.
    /// Returns <c>{ eligible: false }</c> (HTTP 200) when amount is below minimum (default ₹3,000).
    /// No-cost EMI entries are flagged with <c>isNoCostEmi: true</c> and must be shown in accent-red.
    /// </summary>
    [HttpGet("emi-options")]
    public IActionResult GetEmiOptions([FromQuery] decimal amount)
    {
        if (amount <= 0)
            return BadRequest(new { message = "amount must be greater than zero." });

        var options = emiService.GetOptions(amount);
        return Ok(options);
    }
}
