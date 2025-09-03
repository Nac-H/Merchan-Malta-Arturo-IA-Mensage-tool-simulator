import { Logger } from "../utils/logger.js";
export function handleError(customMessage) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            try {
                return await originalMethod.apply(this, args);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Unknown error";
                Logger.error(`Error in ${target}.${propertyKey}: ${customMessage ?? ""}`, errorMessage);
                throw new Error(errorMessage);
            }
        };
        return descriptor;
    };
}
//# sourceMappingURL=handle-error.js.map
