FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY NuGet.Config .
COPY src/Shared/TataCliq.SharedKernel/TataCliq.SharedKernel.csproj       src/Shared/TataCliq.SharedKernel/
COPY src/Services/TataCliq.Gateway.API/TataCliq.Gateway.API.csproj       src/Services/TataCliq.Gateway.API/
RUN dotnet restore src/Services/TataCliq.Gateway.API/TataCliq.Gateway.API.csproj

COPY src/Shared/TataCliq.SharedKernel/    src/Shared/TataCliq.SharedKernel/
COPY src/Services/TataCliq.Gateway.API/   src/Services/TataCliq.Gateway.API/

RUN dotnet publish src/Services/TataCliq.Gateway.API/TataCliq.Gateway.API.csproj \
    -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
COPY --from=build /app/publish .
EXPOSE 80
ENTRYPOINT ["dotnet", "TataCliq.Gateway.API.dll"]
