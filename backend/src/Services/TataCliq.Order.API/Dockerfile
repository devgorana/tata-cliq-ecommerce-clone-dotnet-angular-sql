FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY src/Shared/TataCliq.SharedKernel/TataCliq.SharedKernel.csproj       src/Shared/TataCliq.SharedKernel/
COPY src/Shared/TataCliq.Infrastructure/TataCliq.Infrastructure.csproj   src/Shared/TataCliq.Infrastructure/
COPY src/Services/TataCliq.Order.API/TataCliq.Order.API.csproj            src/Services/TataCliq.Order.API/
RUN dotnet restore src/Services/TataCliq.Order.API/TataCliq.Order.API.csproj

COPY src/Shared/TataCliq.SharedKernel/    src/Shared/TataCliq.SharedKernel/
COPY src/Shared/TataCliq.Infrastructure/  src/Shared/TataCliq.Infrastructure/
COPY src/Services/TataCliq.Order.API/     src/Services/TataCliq.Order.API/

RUN dotnet publish src/Services/TataCliq.Order.API/TataCliq.Order.API.csproj \
    -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 80
ENTRYPOINT ["dotnet", "TataCliq.Order.API.dll"]
