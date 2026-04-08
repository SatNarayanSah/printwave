namespace WebApplication1.Model
{
    public sealed record UserResponseDto(
        Guid Id,
        string Email,
        string FirstName,
        string LastName,
        string? Phone,
        bool IsActive,
        DateTimeOffset CreatedAt,
        DateTimeOffset? LastLogin);
}
