export default {
    base: "/",
    publicRoutes: {
        authRoutes: {
            base: "/auth",
            login: "/login"
        }
    },
    protectedRoutes: {
        base: "/api/v1",
        inventoryRoutes: {
            base: "/inventory"
        },
        orderRoutes: {
            base: "/order"
        }
    },
} as const;
