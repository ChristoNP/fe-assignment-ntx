import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";

const httpLink = createHttpLink({
    uri: 'https://sirefcode.hasura.app/v1/graphql',
    headers: {
        'content-type': 'application/json',
        'x-hasura-admin-secret': 'jw8y3lwW7Vk4HKuROjlbs3flnrYaDsE1vkqNqhtTgv3rIo8bC655Fx6WmSZk4KvO'
    }
})

export const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
})