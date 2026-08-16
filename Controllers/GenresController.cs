using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieApi.Data;
using MovieApi.DTOs;

namespace MovieApi.Controllers
{
    [Route("api/v{version:apiVersion}/genres")]
    [ApiController]
    [ApiVersion("1.0")]
    public class GenresController : ControllerBase
    {
        private readonly MovieDbContext _context;
        private readonly ILogger<GenresController> _logger;

        public GenresController(MovieDbContext context, ILogger<GenresController> logger)
        {
            _context = context;
            _logger  = logger;
        }

        /// <summary>Hämtar alla genrer.</summary>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<GenreDto>>> GetGenres()
        {
            _logger.LogDebug("GetGenres anropat");

            var genres = await _context.Genres
                .OrderBy(g => g.Name)
                .Select(g => new GenreDto { Id = g.Id, Name = g.Name })
                .ToListAsync();

            return Ok(genres);
        }
    }
}
