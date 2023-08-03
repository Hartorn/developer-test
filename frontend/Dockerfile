FROM node:20.5.0-alpine3.17 as base


FROM base as dev

ARG USERNAME=jedi
ARG USER_UID=1000
ARG USER_GID=$USER_UID
ARG HOME_DIR=/home/jedi

# Create a group and user
RUN deluser node && \
    addgroup ${USERNAME} -g ${USER_GID} && \
    adduser ${USERNAME} -u ${USER_UID} -G ${USERNAME} -D -h ${HOME_DIR}
# Add sudo for setup (copy and ownership of files)
RUN apk add sudo
# Ensure there is no prompt for using sudo
RUN echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME && \
    chmod 0440 /etc/sudoers.d/$USERNAME

# Set user
USER $USERNAME

FROM base as build
ARG BACKEND_URL
ENV VITE_BACKEND_URL ${BACKEND_URL}
RUN mkdir -p /build
WORKDIR /build
COPY . /build/
RUN npm ci && npm run build

FROM nginx:1.25.1-alpine as prod

COPY --from=build /build/dist /usr/share/nginx/html