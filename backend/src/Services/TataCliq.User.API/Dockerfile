FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY NuGet.Config .
COPY src/Shared/TataCliq.SharedKernel/TataCliq.SharedKernel.csproj       src/Shared/TataCliq.SharedKernel/
COPY src/Shared/TataCliq.Infrastructure/TataCliq.Infrastructure.csproj   src/Shared/TataCliq.Infrastructure/
COPY src/Services/TataCliq.User.API/TataCliq.User.API.csproj              src/Services/TataCliq.User.API/
RUN dotnet restore src/Services/TataCliq.User.API/TataCliq.User.API.csproj

COPY src/Shared/TataCliq.SharedKernel/    src/Shared/TataCliq.SharedKernel/
COPY src/Shared/TataCliq.Infrastructure/  src/Shared/TataCliq.Infrastructure/
COPY src/Services/TataCliq.User.API/      src/Services/TataCliq.User.API/

RUN dotnet publish src/Services/TataCliq.User.API/TataCliq.User.API.csproj \
    -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
COPY --from=build /app/publish .
EXPOSE 80
ENTRYPOINT ["dotnet", "TataCliq.User.API.dll"]
