using Microsoft.AspNetCore.Mvc;
using WebApplication1.Model;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        [Consumes("application/json")]
        public async Task<ActionResult<UserResponseDto>> Register([FromBody] UserDto? request, CancellationToken cancellationToken)
        {
            if (request is null)
            {
                return BadRequest("Request body is required. Send JSON with fields: email, password, firstName, lastName, phone.");
            }

            var result = await _authService.RegisterAsync(request, cancellationToken);
            if (!result.Succeeded)
            {
                return BadRequest(result.Error);
            }

            var user = result.Value!;
            return Ok(new UserResponseDto(
                user.Id,
                user.Email,
                user.FirstName,
                user.LastName,
                user.Phone,
                user.IsActive,
                user.CreatedAt,
                user.LastLogin));
        }

        [HttpPost("register")]
        [Consumes("multipart/form-data", "application/x-www-form-urlencoded")]
        public Task<ActionResult<UserResponseDto>> RegisterForm([FromForm] UserDto request, CancellationToken cancellationToken)
            => Register(request, cancellationToken);

        [HttpPost("login")]
        [Consumes("application/json")]
        public async Task<ActionResult<string>> Login([FromBody] UserDto? request, CancellationToken cancellationToken)
        {
            if (request is null)
            {
                return BadRequest("Request body is required. Send JSON with fields: email, password.");
            }

            var result = await _authService.LoginAsync(request, cancellationToken);
            if (!result.Succeeded)
            {
                return BadRequest(result.Error);
            }

            return Ok(result.Value);
        }

        [HttpPost("login")]
        [Consumes("multipart/form-data", "application/x-www-form-urlencoded")]
        public Task<ActionResult<string>> LoginForm([FromForm] UserDto request, CancellationToken cancellationToken)
            => Login(request, cancellationToken);
    }
}
