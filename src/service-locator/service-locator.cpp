#include <iostream>
#include <string>
#include <memory>

// Forward declaration of Locator (needed for LoggedService)
class Locator;
class Service;

// 1. Define an abstract Service interface.
class Service : std::enable_shared_from_this<Service>
{
public:
    virtual ~Service() {}
    virtual std::string getName() const = 0;
    virtual void doSomething() = 0;
    virtual std::shared_ptr<Service> get() { return shared_from_this(); }
};

// 2. Define a concrete Service provider.
class ConcreteService : public Service
{
public:
    std::string getName() const override
    {
        return "ConcreteService";
    }

    void doSomething() override
    {
        std::cout << "ConcreteService is doing something." << std::endl;
    }
};

// 3. Define another concrete Service provider.
class AnotherConcreteService : public Service
{
public:
    std::string getName() const override
    {
        return "AnotherConcreteService";
    }

    void doSomething() override
    {
        std::cout << "AnotherConcreteService is doing something else." << std::endl;
    }
};

// 4. Implement the Null Object pattern for the Service.
class NullService : public Service
{
public:
    std::string getName() const override
    {
        return "NullService";
    }

    void doSomething() override
    {
        // Do nothing.
        std::cout << "No service registered." << std::endl;
    }
};

// 5. Implement a Logging Decorator for the Service.
class LoggedService : public Service
{
public:
    LoggedService(std::shared_ptr<Service> service) : service_(service) {}

    std::string getName() const override
    {
        return service_->getName();
    }

    std::shared_ptr<Service> getUndecoratedService() const
    {
        return service_;
    }

    void doSomething() override
    {
        std::cout << "Logging: About to call " << service_->getName() << "'s doSomething()." << std::endl;
        service_->doSomething();
        std::cout << "Logging: Finished calling " << service_->getName() << "'s doSomething()." << std::endl;
    }

    std::shared_ptr<Service> get() override
    {
        return service_;
    }

private:
    std::shared_ptr<Service> service_;
};

// 6. Implement the globally accessible Service Locator.
class Locator
{
public:
    // Static method to get the instance of the service.
    static std::shared_ptr<Service> getService()
    {
        if (!service_)
        {
            // Provide a NullService if no service has been registered.
            initialize();
        }
        return service_;
    }

    // Static method to register a service provider.
    static void provide(std::shared_ptr<Service> service)
    {
        service_ = service;
        isLoggingEnabled_ = false; // Reset logging when a new service is provided
    }

    // Static method to enable logging for the currently registered service.
    static void enableLogging()
    {
        provide(std::make_shared<LoggedService>(service_));
        isLoggingEnabled_ = true;
    }

    // Static method to disable logging.
    static void disableLogging()
    {
        auto loggedService = std::dynamic_pointer_cast<LoggedService>(service_);
        if (loggedService)
        {
            // Restore the original service wrapped by LoggedService
            provide(loggedService->get());
        }
        else
        {
            std::cerr << "Logging is not enabled, cannot disable logging." << std::endl;
        }
        isLoggingEnabled_ = false;
    }

private:
    // Static instance of the service. Initialized with a NullService.
    static std::shared_ptr<Service> service_;
    static bool isLoggingEnabled_;

    // Private static method to initialize the locator with a NullService.
    static void initialize()
    {
        service_ = std::make_shared<NullService>();
        isLoggingEnabled_ = false;
    }

    // Private constructor to prevent instantiation of the Locator class.
    Locator() = delete;
};

// Initialize the static members of Locator.
std::shared_ptr<Service> Locator::service_ = nullptr;
bool Locator::isLoggingEnabled_ = false;

void clientCode()
{
    // Client code accesses the service through the globally accessible Locator.
    std::cout << "Client using service: " << Locator::getService()->getName() << std::endl;
    Locator::getService()->doSomething();
    std::cout << std::endl;
}

int main()
{
    std::cout << "** Initial state (no service registered) **" << std::endl;
    clientCode();

    std::cout << "** Registering ConcreteService **" << std::endl;
    auto concreteService = std::make_shared<ConcreteService>();
    Locator::provide(concreteService);
    clientCode();

    std::cout << "** Enabling logging for ConcreteService **" << std::endl;
    Locator::enableLogging();
    clientCode();

    std::cout << "** Registering AnotherConcreteService **" << std::endl;
    auto anotherConcreteService = std::make_shared<AnotherConcreteService>();
    Locator::provide(anotherConcreteService);
    clientCode(); // Logging is disabled by default when a new service is provided

    std::cout << "** Enabling logging for AnotherConcreteService **" << std::endl;
    Locator::enableLogging();
    clientCode();

    std::cout << "** Disabling logging **" << std::endl;
    Locator::disableLogging();
    clientCode();

    std::cout << "** Providing nullptr (should revert to NullService) **" << std::endl;
    Locator::provide(nullptr); // Check for NULL to revert to null service.
    clientCode();

    return 0;
}

/*
Design Choices and Information (as comments in the code):

- Abstract Service Interface: We define an abstract `Service` class with virtual methods (`getName`, `doSomething`). This provides a contract that concrete services must adhere to. Using an interface promotes decoupling.
- Concrete Service Providers: `ConcreteService` and `AnotherConcreteService` are concrete implementations of the `Service` interface, representing different functionalities or versions of the service.
- Null Object Pattern: `NullService` implements the `Service` interface but performs no actual operation. This avoids null pointer exceptions when no real service is registered. The `Locator` initialises with and can revert to this service.
- Logging Decorator: `LoggedService` wraps another `Service` object and adds logging behaviour before and after calling the wrapped service's methods. It implements the same `Service` interface, making it transparent to the client.
- Globally Accessible Locator: The `Locator` class provides static methods (`getService`, `provide`, `enableLogging`, `disableLogging`) making it a global point of access to the service. The constructor is deleted to prevent instantiation of `Locator` objects.
- Service Registration (`provide`): The `provide` method allows external code to register a concrete implementation of the `Service` interface with the `Locator`. This is a form of dependency injection where the service is provided to the locator instead of the locator creating it.
- Service Retrieval (`getService`): The `getService` method returns the currently registered service. If no service is registered, it returns the `NullService`, ensuring a valid object is always returned.
- Enabling/Disabling Logging: The `enableLogging` method wraps the currently registered service with a `LoggedService` instance, adding logging functionality. The `disableLogging` method (in this simplified example) attempts to unwrap the logging decorator.
- Runtime Service Switching: The `provide` method allows changing the concrete service implementation at runtime. The client code interacts with the service through the abstract `Service` interface, remaining unaware of the actual concrete implementation in use.
- Lazy Initialisation (Implicit): While not explicitly lazy in the first access of `getService` when no service is provided, the registration of the actual service happens at runtime, after the program has started. The `NullService` acts as a default until a real service is provided.
- Use of `std::shared_ptr`: Smart pointers (`std::shared_ptr`) are used for managing the lifetime of the service objects, reducing the risk of memory leaks.

This program demonstrates the core principles of the Service Locator pattern, including global access, decoupling, the Null Object pattern, and the ability to modify service behaviour (through wrapping) and implementations at runtime.
*/
