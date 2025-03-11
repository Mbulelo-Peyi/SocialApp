import pika

try:
    # Connection parameters (check if RabbitMQ is running on the same machine)
    params = pika.URLParameters("amqp://guest:guest@127.0.0.1:5672/")
    
    # Establish a connection to RabbitMQ
    connection = pika.BlockingConnection(params)
    
    # Check if the connection is open
    if connection.is_open:
        print("✅ RabbitMQ is connected!")
    else:
        print("❌ Failed to connect to RabbitMQ!")
    
    # Close the connection
    connection.close()
except Exception as e:
    print(f"Error: {e}")
