using Microsoft.AspNetCore.Mvc;
using TataCliq.Catalog.API.Services;

namespace TataCliq.Catalog.API.Controllers;

[ApiController]
[Route("api/v1/search")]
public sealed class SearchController(ISearchSuggestService suggestService) : ControllerBase
{
    /// <summary>
    /// ENH-SRCH-002 — Returns autocomplete suggestions for the given query string.
    /// Returns an empty suggestions array (HTTP 200) for queries shorter than 2 characters.
    /// </summary>
    /// <param name="q">Search prefix (≥2 chars for results).</param>
    /// <param name="ct">Cancellation token.</param>
    [HttpGet("suggest")]
    public async Task<IActionResult> Suggest(
        [FromQuery] string q = "",
        CancellationToken ct = default)
    {
        var result = await suggestService.GetSuggestionsAsync(q, ct);
        return Ok(result);
    }
}
