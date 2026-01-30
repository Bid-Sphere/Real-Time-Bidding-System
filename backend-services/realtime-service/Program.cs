using RealTimeService.Hubs;
using RealTimeService.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Controllers + Swagger with JSON options for enum serialization
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Serialize enums as strings to match Java behavior
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// HttpClient for AuctionService
builder.Services.AddHttpClient<IAuctionService, AuctionService>();

// SignalR + Redis backplane with JSON options
builder.Services.AddSignalR()
    .AddJsonProtocol(options =>
    {
        // Serialize enums as strings to match Java behavior
        options.PayloadSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    })
    .AddStackExchangeRedis(builder.Configuration["Redis:ConnectionString"], options =>
    {
        options.Configuration.ChannelPrefix = "BidSphere";
    });

// CORS (frontend)
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() 
    ?? new[] { "http://localhost:3000", "http://localhost:5173" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// JWT Authentication
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]))
        };

        // SignalR token support
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var token = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;

                if (!string.IsNullOrEmpty(token) && path.StartsWithSegments("/hubs"))
                {
                    context.Token = token;
                }

                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
    ConnectionMultiplexer.Connect(builder.Configuration["Redis:ConnectionString"]));


var app = builder.Build();

// Middleware pipeline
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers();

// SignalR hubs
app.MapHub<AuctionHub>("/hubs/auction");
app.MapHub<NotificationHub>("/hubs/notifications");

app.Run();
