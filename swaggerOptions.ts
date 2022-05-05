export const options = (port: string) => {
    return {
        definition: {
            openapi: '3.0.0',
            info: {
              title: 'Hello World',
              version: '1.0.0',
            },
            servers: [
                {
                    url: `http://localhost:${port}`,
                },
            ],
        },
        apis: ['./routes/*.ts', './server.ts', './authServer.ts'] // files containing annotations as above
    }
}