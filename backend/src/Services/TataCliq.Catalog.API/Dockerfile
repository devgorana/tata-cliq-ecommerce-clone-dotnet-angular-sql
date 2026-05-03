FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY NuGet.Config .
COPY src/Shared/TataCliq.SharedKernel/TataCliq.SharedKernel.csproj       src/Shared/TataCliq.SharedKernel/
COPY src/Shared/TataCliq.Infrastructure/TataCliq.Infrastructure.csproj   src/Shared/TataCliq.Infrastructure/
COPY src/Services/TataCliq.Catalog.API/TataCliq.Catalog.API.csproj        src/Services/TataCliq.Catalog.API/
RUN dotnet restore src/Services/TataCliq.Catalog.API/TataCliq.Catalog.API.csproj

COPY src/Shared/TataCliq.SharedKernel/    src/Shared/TataCliq.SharedKernel/
COPY src/Shared/TataCliq.Infrastructure/  src/Shared/TataCliq.Infrastructure/
COPY src/Services/TataCliq.Catalog.API/   src/Services/TataCliq.Catalog.API/

RUN dotnet publish src/Services/TataCliq.Catalog.API/TataCliq.Catalog.API.csproj \
    -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 80
ENTRYPOINT ["dotnet", "TataCliq.Catalog.API.dll"]
