FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY NuGet.Config .
COPY src/Shared/TataCliq.SharedKernel/TataCliq.SharedKernel.csproj       src/Shared/TataCliq.SharedKernel/
COPY src/Shared/TataCliq.Infrastructure/TataCliq.Infrastructure.csproj   src/Shared/TataCliq.Infrastructure/
COPY src/Services/TataCliq.Cart.API/TataCliq.Cart.API.csproj              src/Services/TataCliq.Cart.API/
RUN dotnet restore src/Services/TataCliq.Cart.API/TataCliq.Cart.API.csproj

COPY src/Shared/TataCliq.SharedKernel/    src/Shared/TataCliq.SharedKernel/
COPY src/Shared/TataCliq.Infrastructure/  src/Shared/TataCliq.Infrastructure/
COPY src/Services/TataCliq.Cart.API/      src/Services/TataCliq.Cart.API/

RUN dotnet publish src/Services/TataCliq.Cart.API/TataCliq.Cart.API.csproj \
    -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 80
ENTRYPOINT ["dotnet", "TataCliq.Cart.API.dll"]
