FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["src/Services/TataCliq.Media.API/TataCliq.Media.API.csproj", "src/Services/TataCliq.Media.API/"]
COPY ["src/Shared/TataCliq.Infrastructure/TataCliq.Infrastructure.csproj", "src/Shared/TataCliq.Infrastructure/"]
COPY ["src/Shared/TataCliq.SharedKernel/TataCliq.SharedKernel.csproj", "src/Shared/TataCliq.SharedKernel/"]
RUN dotnet restore "src/Services/TataCliq.Media.API/TataCliq.Media.API.csproj"

COPY . .
WORKDIR "/src/src/Services/TataCliq.Media.API"
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /app/uploads
VOLUME ["/app/uploads"]

COPY --from=build /app/publish .
EXPOSE 80
ENTRYPOINT ["dotnet", "TataCliq.Media.API.dll"]
