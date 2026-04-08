using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebApplication1.Data;
using WebApplication1.Entities;
using WebApplication1.Model;

namespace WebApplication1.Services
{
    public interface IAuthService
    {
        Task<AuthServiceResult<User>> RegisterAsync(UserDto request, CancellationToken cancellationToken = default);
        Task<AuthServiceResult<string>> LoginAsync(UserDto request, CancellationToken cancellationToken = default);
    }

    public sealed class AuthService : IAuthService
    {
        private readonly MyDbContext _db;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly JwtOptions _jwtOptions;

        public AuthService(
            MyDbContext db,
            IPasswordHasher<User> passwordHasher,
            IOptions<JwtOptions> jwtOptions)
        {
            _db = db;
            _passwordHasher = passwordHasher;
            _jwtOptions = jwtOptions.Value;
        }

        public async Task<AuthServiceResult<User>> RegisterAsync(
            UserDto request,
            CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
            {
                return AuthServiceResult<User>.Fail("Email is required.");
            }

            if (string.IsNullOrWhiteSpace(request.Password))
            {
                return AuthServiceResult<User>.Fail("Password is required.");
            }

            if (string.IsNullOrWhiteSpace(request.FirstName))
            {
                return AuthServiceResult<User>.Fail("First name is required.");
            }

            if (string.IsNullOrWhiteSpace(request.LastName))
            {
                return AuthServiceResult<User>.Fail("Last name is required.");
            }

            var email = request.Email.Trim().ToLowerInvariant();
            var firstName = request.FirstName.Trim();
            var lastName = request.LastName.Trim();
            var phone = string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim();

            var exists = await _db.Users
                .AsNoTracking()
                .AnyAsync(u => u.Email == email, cancellationToken);

            if (exists)
            {
                return AuthServiceResult<User>.Fail("Email is already taken.");
            }

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = email,
                FirstName = firstName,
                LastName = lastName,
                Phone = phone,
                IsActive = true,
                CreatedAt = DateTimeOffset.UtcNow,
                LastLogin = null,
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

            _db.Users.Add(user);
            await _db.SaveChangesAsync(cancellationToken);

            return AuthServiceResult<User>.Success(user);
        }

        public async Task<AuthServiceResult<string>> LoginAsync(
            UserDto request,
            CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return AuthServiceResult<string>.Fail("Email and password are required.");
            }

            var email = request.Email.Trim().ToLowerInvariant();

            var user = await _db.Users
                .SingleOrDefaultAsync(u => u.Email == email, cancellationToken);

            if (user is null)
            {
                return AuthServiceResult<string>.Fail("User not found.");
            }

            if (!user.IsActive)
            {
                return AuthServiceResult<string>.Fail("User is inactive.");
            }

            var verification = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
            if (verification == PasswordVerificationResult.Failed)
            {
                return AuthServiceResult<string>.Fail("Wrong password.");
            }

            user.LastLogin = DateTimeOffset.UtcNow;
            await _db.SaveChangesAsync(cancellationToken);

            return AuthServiceResult<string>.Success(CreateToken(user));
        }

        private string CreateToken(User user)
        {
            if (string.IsNullOrWhiteSpace(_jwtOptions.Token))
            {
                throw new InvalidOperationException($"Missing JWT secret in configuration section '{JwtOptions.SectionName}:Token'.");
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Email),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.Token));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var token = new JwtSecurityToken(
                issuer: _jwtOptions.Issuer,
                audience: _jwtOptions.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public sealed class JwtOptions
    {
        public const string SectionName = "AppSetting";

        public string Token { get; init; } = string.Empty;
        public string Issuer { get; init; } = string.Empty;
        public string Audience { get; init; } = string.Empty;
    }

    public readonly record struct AuthServiceResult<T>(T? Value, string? Error)
    {
        public bool Succeeded => Error is null;

        public static AuthServiceResult<T> Success(T value) => new(value, null);
        public static AuthServiceResult<T> Fail(string error) => new(default, error);
    }
}
