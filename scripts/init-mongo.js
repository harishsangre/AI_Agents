// Initialize MongoDB with collections and indexes

db = db.getSiblingDB('ai_agents');

// Create collections with validation schema
db.createCollection('users');
db.createCollection('agents');
db.createCollection('pdf_files');
db.createCollection('knowledge_chunks');
db.createCollection('widgets');
db.createCollection('chat_sessions');
db.createCollection('audit_logs');

// Create indexes for better performance

// Users collection
db.users.createIndex({ 'googleId': 1 }, { unique: true });
db.users.createIndex({ 'email': 1 }, { unique: true });
db.users.createIndex({ 'createdAt': 1 });

// Agents collection
db.agents.createIndex({ 'tenantId': 1 });
db.agents.createIndex({ 'tenantId': 1, 'status': 1 });
db.agents.createIndex({ 'createdAt': -1 });
db.agents.createIndex({ 'vectorNamespace': 1 }, { unique: true });

// PDF Files collection
db.pdf_files.createIndex({ 'tenantId': 1 });
db.pdf_files.createIndex({ 'tenantId': 1, 'agentId': 1 });
db.pdf_files.createIndex({ 'createdAt': -1 });

// Knowledge chunks collection
db.knowledge_chunks.createIndex({ 'tenantId': 1 });
db.knowledge_chunks.createIndex({ 'tenantId': 1, 'agentId': 1 });
db.knowledge_chunks.createIndex({ 'vectorId': 1 });
db.knowledge_chunks.createIndex({ 'createdAt': -1 });

// Widgets collection
db.widgets.createIndex({ 'tenantId': 1 });
db.widgets.createIndex({ 'tenantId': 1, 'agentId': 1 });
db.widgets.createIndex({ 'widgetKey': 1 }, { unique: true });

// Chat sessions collection
db.chat_sessions.createIndex({ 'tenantId': 1 });
db.chat_sessions.createIndex({ 'tenantId': 1, 'agentId': 1 });
db.chat_sessions.createIndex({ 'visitorId': 1 });
db.chat_sessions.createIndex({ 'createdAt': -1 });
db.chat_sessions.createIndex({ 'createdAt': 1 }, { expireAfterSeconds: 7776000 }); // 90 days TTL

// Audit logs collection
db.audit_logs.createIndex({ 'tenantId': 1 });
db.audit_logs.createIndex({ 'userId': 1 });
db.audit_logs.createIndex({ 'createdAt': -1 });
db.audit_logs.createIndex({ 'createdAt': 1 }, { expireAfterSeconds: 2592000 }); // 30 days TTL

print('MongoDB initialization completed successfully!');
