# Docker image that contains a Spring Boot application.
# Base image - use alpine, a minimalistic Linux release, to conserve space
FROM docker-registry.ontotext.com/graphdb:9.3.0-ee

# Init with the soaas repository configuration.
COPY repo.ttl /opt/graphdb/dist/data/repositories/soaas/config.ttl
COPY graphdb.license /opt/graphdb/dist/conf/graphdb.license

ENTRYPOINT ["/opt/graphdb/dist/bin/graphdb"]

EXPOSE 7200
