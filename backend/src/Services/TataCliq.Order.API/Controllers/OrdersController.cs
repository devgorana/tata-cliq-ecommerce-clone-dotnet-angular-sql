using System.Security.Claims;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TataCliq.Order.API.DTOs;
using TataCliq.Order.API.Services;

namespace TataCliq.Order.API.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize]
public sealed class OrdersController(
    IOrderService orderService,
    IValidator<PlaceOrderRequest> validator) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> PlaceOrder([FromBody] PlaceOrderRequest request, CancellationToken ct)
    {
        var validation = await validator.ValidateAsync(request, ct);
        if (!validation.IsValid) return BadRequest(validation.Errors);

        try
        {
            var order = await orderService.PlaceOrderAsync(UserId, request, ct);
            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpGet]
    public async Task<IActionResult> GetOrders(CancellationToken ct)
    {
        var orders = await orderService.GetOrdersAsync(UserId, ct);
        return Ok(orders);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetOrder(Guid id, CancellationToken ct)
    {
        var order = await orderService.GetOrderAsync(UserId, id, ct);
        return order is null ? NotFound() : Ok(order);
    }

    [HttpPost("{id:guid}/cancel")]
    public async Task<IActionResult> CancelOrder(Guid id, CancellationToken ct)
    {
        try
        {
            await orderService.CancelOrderAsync(UserId, id, ct);
            return NoContent();
        }
        catch (KeyNotFoundException)       { return NotFound(); }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
    }
}
