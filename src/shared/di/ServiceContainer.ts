/**
 * ServiceContainer
 *
 * Simple Dependency Injection container.
 * Implementa el patrón Service Locator con lazy loading.
 */

type ServiceFactory<T> = () => T
type ServiceInstance<T> = T

class ServiceContainer {
  private factories = new Map<string, ServiceFactory<unknown>>()
  private instances = new Map<string, ServiceInstance<unknown>>()

  /**
   * Registra una factory para un servicio
   */
  register<T>(name: string, factory: ServiceFactory<T>): void {
    this.factories.set(name, factory as ServiceFactory<unknown>)
  }

  /**
   * Registra un singleton (instancia única)
   */
  registerSingleton<T>(name: string, instance: T): void {
    this.instances.set(name, instance as ServiceInstance<unknown>)
  }

  /**
   * Resuelve un servicio (crea la instancia si no existe)
   */
  resolve<T>(name: string): T {
    // Verificar si ya existe una instancia
    if (this.instances.has(name)) {
      return this.instances.get(name) as T
    }

    // Obtener factory
    const factory = this.factories.get(name)
    if (!factory) {
      throw new Error(`Service '${name}' not registered`)
    }

    // Crear instancia y guardarla (singleton por defecto)
    const instance = factory() as T
    this.instances.set(name, instance as ServiceInstance<unknown>)

    return instance
  }

  /**
   * Verifica si un servicio está registrado
   */
  has(name: string): boolean {
    return this.factories.has(name) || this.instances.has(name)
  }

  /**
   * Limpia todas las instancias (útil para testing)
   */
  clear(): void {
    this.instances.clear()
  }

  /**
   * Limpia todo (factories e instancias)
   */
  reset(): void {
    this.factories.clear()
    this.instances.clear()
  }
}

// Instancia global del container
export const container = new ServiceContainer()
