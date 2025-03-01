import { adminClient, inferAdditionalFields } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react" // make sure to import from better-auth/react
 
export const authClient =  createAuthClient({
    //you can pass client configuration here
    plugins: [
        adminClient(),
        inferAdditionalFields({
            user: {
                displayName: {
                    type: "string",
                },
                bio: {
                    type: "string",
                },
                phoneNumber: {
                    type: "string",
                },
                location: {
                    type: "string",
                },
                balance: {
                    type: "number",
                },
            }
        })
    ]
})