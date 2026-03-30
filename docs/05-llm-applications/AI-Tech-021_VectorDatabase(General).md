# 向量数据库与AI应用实战

## 一、向量数据库概述

### 1.1 什么是向量数据库

向量数据库是一种专门用于存储和检索高维向量数据的数据库系统。在AI和机器学习应用中，向量数据库扮演着至关重要的角色，它们能够高效地进行相似性搜索，这在构建现代AI应用中不可或缺。

与传统关系型数据库不同，向量数据库的核心优势在于能够处理非结构化数据（如文本、图像、音频）通过embedding技术转换成的向量表示。这种能力使得向量数据库成为大语言模型（LLM）应用、推荐系统、语义搜索等场景的基础设施。

### 1.2 为什么AI应用需要向量数据库

在传统的AI应用中，我们通常使用关键词匹配来进行搜索。但这种方法存在明显的局限性：它无法理解语义含义，无法处理同义词和近义词，也无法处理拼写错误。而向量数据库通过将文本转换为向量表示，能够实现语义级别的匹配。

例如，当用户搜索"苹果手机"时，传统数据库可能无法返回"iPhone"相关的结果，因为数据库中存储的是"iPhone"而非"苹果手机"。但向量数据库能够理解"苹果手机"和"iPhone"在语义上是相近的，因此能够返回正确的搜索结果。

这种语义理解能力使得向量数据库成为构建智能问答系统、聊天机器人、推荐系统等AI应用的关键组件。

### 1.3 向量嵌入的工作原理

向量嵌入（Vector Embedding）是将文本、图像或其他非结构化数据转换为数值向量的过程。这些向量能够捕捉数据的语义信息和特征，使得相似的对象在向量空间中彼此靠近。

常见的embedding模型包括：

- **Word2Vec**：将单词映射到低维向量空间
- **BERT**：基于Transformer的预训练语言模型
- **Sentence-BERT**：专门用于句子级别的语义匹配
- **OpenAI Embeddings**：OpenAI提供的文本嵌入API
- **Cohere Embeddings**：Cohere公司提供的嵌入服务

### 1.4 核心概念详解

**向量维度（Vector Dimensionality）**：向量数据库中每个向量包含的维度数量。维度越高，能捕捉的信息越丰富，但同时存储和计算成本也越高。常见的维度包括128、256、512、768、1536甚至更高。

**相似度度量（Similarity Metrics）**：用于衡量向量之间相似程度的算法。常见的度量方式包括：

- **余弦相似度（Cosine Similarity）**：计算两个向量夹角的余弦值，范围[-1, 1]
- **欧氏距离（Euclidean Distance）**：计算两点之间的直线距离
- **曼哈顿距离（Manhattan Distance）**：计算各坐标差绝对值之和
- **点积（Dot Product）**：两个向量对应元素乘积之和

**最近邻搜索（Nearest Neighbor Search）**：在向量数据库中查找与给定查询向量最相似的向量。分为精确搜索和近似搜索（ANN）两种。

**近似最近邻（ANN）**：由于精确搜索在海量数据中效率低下，ANN算法通过牺牲一定精度来换取更高的查询速度。常见的ANN算法包括HNSW、IVF、PQ等。

## 二、主流向量数据库深度对比

### 2.1 Pinecone

Pinecone是目前最流行的云原生向量数据库之一，由AWS提供支持。它以其卓越的可扩展性和托管服务而闻名。

**核心特性**：
- 全托管服务，无需运维
- 自动索引管理
- 高可用性和持久性
- 实时数据更新
- 支持元数据过滤

**技术架构**：
Pinecone采用分布式架构，支持多区域部署。其索引采用SSTable + LSM树结构，确保写入性能。查询处理使用自定义的向量索引算法，结合HNSW和量化技术。

**性能表现**：
- 写入吞吐量：支持每秒数百万向量写入
- 查询延迟：亚毫秒级（99百分位延迟<10ms）
- 向量规模：支持数十亿级向量存储
- 维度支持：最高2048维

**适用场景**：
- 企业级语义搜索
- LLM应用的长期记忆存储
- 推荐系统
- 问答系统

**定价模式**：
Pinecone采用按使用量计费，包括存储、查询和带宽费用。免费层提供有限的存储和查询配额。

### 2.2 Weaviate

Weaviate是一个开源的向量搜索引擎，具有强大的混合搜索能力。

**核心特性**：
- 混合搜索（向量+关键词）
- 全文搜索能力
- 图结构支持
- 插件式embedding模型
- 丰富的查询语言

**技术架构**：
Weaviate采用模块化设计，支持多种存储后端（GraphDB、 PostgreSQL）。其索引基于HNSW算法，支持实时索引更新。

**性能表现**：
- 查询延迟：毫秒级
- 支持数据规模：十亿级
- 支持维度：最高4096维

**适用场景**：
- 语义搜索
- 知识图谱增强
- 多模态搜索

### 2.3 Milvus

Milvus是由Zilliz开发的开源向量数据库，是Apache基金会的顶级项目。

**核心特性**：
- 分布式架构
- 多种索引类型（HNSW、IVF、PQ、GPU加速）
- 丰富的过滤表达式
- 时序数据支持
- 云原生部署

**技术架构**：
Milvus采用存储计算分离架构，支持Kubernetes部署。其索引支持GPU加速，能够处理超大规模向量数据。

**性能表现**：
- 写入性能：每秒百万级
- 查询性能：毫秒级
- 规模：支持万亿级向量

**适用场景**：
- 大规模向量检索
- AI应用后端
- 多媒体检索

### 2.4 Chroma

Chroma是一个轻量级的开源向量数据库，专为AI应用设计。

**核心特性**：
- 简单易用的API
- 内置embedding支持
- 本地部署为主
- 与Python生态完美集成

**技术架构**：
Chroma设计简洁，主要面向中小规模应用。数据存储支持SQLite后端和内存模式。

**性能表现**：
- 适合中小规模数据
- 查询延迟：毫秒级

**适用场景**：
- 原型开发
- 小规模生产应用
- 本地AI应用

### 2.5 Qdrant

Qdrant是一个用Rust开发的高性能向量搜索引擎。

**核心特性**：
- 高性能（Rust实现）
- 过滤条件支持
- 多种距离度量
- 分布式支持
- 丰富的API

**技术架构**：
Qdrant采用Rust编写，具有出色的内存安全和性能。其索引基于HNSW算法，支持自定义评分函数。

**性能表现**：
- 查询速度：业界领先
- 内存效率：高
- 规模：支持十亿级

**适用场景**：
- 高性能向量检索
- 推荐系统
- 语义搜索

### 2.6 对比总结

| 特性 | Pinecone | Weaviate | Milvus | Chroma | Qdrant |
|------|----------|-----------|--------|--------|--------|
| 托管服务 | ✅ | ❌ | ❌ | ❌ | ❌ |
| 开源 | ❌ | ✅ | ✅ | ✅ | ✅ |
| 分布式 | ✅ | ✅ | ✅ | ❌ | ✅ |
| GPU加速 | ✅ | ❌ | ✅ | ❌ | ❌ |
| 混合搜索 | ❌ | ✅ | ❌ | ❌ | ✅ |
| 社区活跃度 | 高 | 高 | 高 | 中 | 中 |

## 三、向量数据库实战应用

### 3.1 环境搭建与安装

**Python环境要求**：
```bash
# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或
venv\Scripts\activate  # Windows

# 安装依赖
pip install pinecone-client weaviate-client pymilvus chromadb qdrant-client
pip install numpy scipy scikit-learn
```

### 3.2 Pinecone实战

**初始化连接**：
```python
import pinecone

# 初始化Pinecone
pinecone.init(
    api_key="YOUR_API_KEY",
    environment="us-west1-gcp"
)

# 创建索引
index_name = "ai-applications"

# 检查索引是否存在，存在则删除
if index_name in pinecone.list_indexes():
    pinecone.delete_index(index_name)

# 创建新索引
pinecone.create_index(
    name=index_name,
    dimension=1536,  # OpenAI ada-002 embedding维度
    metric="cosine",
    shards=1
)

# 连接索引
index = pinecone.Index(index_name)
```

**向量插入**：
```python
import numpy as np
from datetime import datetime

# 准备向量数据
vectors = []
ids = []

for i in range(100):
    # 生成随机向量
    vector = np.random.rand(1536).tolist()
    vectors.append(vector)
    ids.append(f"doc_{i}")

# 元数据
metadatas = [
    {"text": f"文档{i}内容", "category": "tech", "timestamp": datetime.now().isoformat()}
    for i in range(100)
]

# 批量插入
index.upsert(
    vectors=list(zip(ids, vectors, metadatas)),
    namespace="production"
)

print("成功插入100条向量")
```

**相似性查询**：
```python
# 查询向量
query_vector = np.random.rand(1536).tolist()

# 执行搜索
results = index.query(
    vector=query_vector,
    top_k=10,
    include_metadata=True,
    filter={"category": {"$eq": "tech"}}
)

# 处理结果
for match in results['matches']:
    print(f"ID: {match['id']}")
    print(f"分数: {match['score']}")
    print(f"内容: {match['metadata']['text']}")
    print("---")
```

### 3.3 Weaviate实战

**连接与创建Schema**：
```python
import weaviate
from weaviate import AuthApiKey

# 连接Weaviate
client = weaviate.Client(
    url="http://localhost:8080",
    additional_headers={
        "X-OpenAI-Api-Key": "YOUR_OPENAI_API_KEY"
    }
)

# 创建Schema
schema = {
    "class": "Article",
    "description": "技术文章",
    "vectorizer": "text2vec-transformers",
    "moduleConfig": {
        "text2vec-transformers": {
            "vectorizeClassName": False
        }
    },
    "properties": [
        {"name": "title", "dataType": ["text"]},
        {"name": "content", "dataType": ["text"]},
        {"name": "category", "dataType": ["text"]},
        {"name": "tags", "dataType": ["text[]"]}
    ]
}

# 创建类
client.schema.create_class(schema)
print("Schema创建成功")
```

**数据导入**：
```python
# 准备数据
data_objects = [
    {
        "title": "向量数据库完全指南",
        "content": "本文详细介绍向量数据库的原理和应用...",
        "category": "数据库",
        "tags": ["向量数据库", "AI", "数据库"]
    },
    {
        "title": "LLM应用架构设计",
        "content": "构建企业级LLM应用的架构模式和最佳实践...",
        "category": "架构",
        "tags": ["LLM", "AI", "架构"]
    }
]

# 批量导入
with client.batch as batch:
    for data in data_objects:
        batch.add_data_object(data, "Article")

print("数据导入成功")
```

**混合搜索**：
```python
# 混合搜索
response = client.query.get("Article") \
    .with_hybrid(
        query="向量数据库 AI",
        alpha=0.5  # 关键词与向量搜索的权重
    ) \
    .with_limit(5) \
    .do()

# 处理结果
for obj in response['data']['Get']['Article']:
    print(f"标题: {obj['title']}")
    print(f"内容: {obj['content']}")
    print(f"分类: {obj['category']}")
    print("---")
```

### 3.4 Milvus实战

**连接与集合管理**：
```python
from pymilvus import connections, Collection, FieldSchema, CollectionSchema, DataType, utility

# 连接Milvus
connections.connect(host="localhost", port="19530")

# 定义Schema
fields = [
    FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
    FieldSchema(name="title", dtype=DataType.VARCHAR, max_length=256),
    FieldSchema(name="content", dtype=DataType.VARCHAR, max_length=4096),
    FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=768)
]

schema = CollectionSchema(fields=fields, description="文章集合")

# 创建集合
collection = Collection(name="articles", schema=schema)
print(f"集合创建成功: {collection.name}")
```

**创建索引**：
```python
# 创建索引
index_params = {
    "index_type": "HNSW",
    "metric_type": "IP",  # 内积
    "params": {
        "M": 32,
        "efConstruction": 200
    }
}

collection.create_index(field_name="embedding", index_params=index_params)

# 加载集合到内存
collection.load()
print("索引创建成功")
```

**数据操作**：
```python
import numpy as np

# 准备数据
titles = ["向量数据库指南", "AI应用开发", "机器学习实战"]
contents = ["详细介绍向量数据库...", "构建AI应用...", "机器学习项目实践..."]

# 生成随机embedding
embeddings = [np.random.rand(768).tolist() for _ in range(3)]

# 插入数据
entities = [titles, contents, embeddings]
insert_result = collection.insert(entities)

print(f"插入成功，ID: {insert_result.primary_ids}")

# 刷新使数据可见
collection.flush()
```

**向量搜索**：
```python
# 查询向量
query_embedding = np.random.rand(768).tolist()

# 执行搜索
search_params = {"metric_type": "IP", "ef": 64}
results = collection.search(
    data=[query_embedding],
    anns_field="embedding",
    param=search_params,
    limit=3,
    output_fields=["title", "content"]
)

# 处理结果
for hits in results:
    for hit in hits:
        print(f"ID: {hit.id}")
        print(f"距离: {hit.distance}")
        print(f"标题: {hit.entity.get('title')}")
        print("---")
```

### 3.5 Chroma实战

**快速入门**：
```python
import chromadb
from chromadb.config import Settings

# 初始化Chroma
client = chromadb.Client(Settings(
    anonymized_telemetry=False,
    allow_reset=True
))

# 创建集合
collection = client.create_collection(
    name="ai_docs",
    metadata={"hnsw:space": "cosine"}
)

print(f"集合创建成功: {collection.name}")
```

**数据操作**：
```python
# 添加文档
collection.add(
    documents=[
        "向量数据库是AI应用的核心组件",
        "LLM使用embedding来表示语义信息",
        "RAG技术结合检索和生成来增强LLM"
    ],
    metadatas=[
        {"source": "db-guide", "category": "database"},
        {"source": "llm-guide", "category": "ai"},
        {"source": "rag-guide", "category": "ai"}
    ],
    ids=["doc1", "doc2", "doc3"]
)

print("文档添加成功")
```

**查询**：
```python
# 语义搜索
results = collection.query(
    query_texts=["语义搜索技术"],
    n_results=2
)

# 输出结果
for i, (doc, meta, dist) in enumerate(zip(
    results['documents'][0],
    results['metadatas'][0],
    results['distances'][0]
)):
    print(f"结果{i+1}:")
    print(f"文档: {doc}")
    print(f"元数据: {meta}")
    print(f"距离: {dist}")
    print("---")
```

### 3.6 Qdrant实战

**连接与集合**：
```python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from qdrant_client.http.models import Filter, FieldCondition, MatchValue

# 连接Qdrant
client = QdrantClient(host="localhost", port=6333)

# 创建集合
client.create_collection(
    collection_name="ai_articles",
    vectors_config=VectorParams(size=768, distance=Distance.COSINE)
)

print("集合创建成功")
```

**数据操作**：
```python
import numpy as np

# 准备数据
points = [
    PointStruct(
        id=i,
        vector=np.random.rand(768).tolist(),
        payload={
            "title": f"文章{i}",
            "content": f"这是第{i}篇文章的内容",
            "category": "tech"
        }
    )
    for i in range(10)
]

# 批量插入
client.upsert(
    collection_name="ai_articles",
    points=points
)

print("数据插入成功")
```

**搜索与过滤**：
```python
# 向量搜索
query_vector = np.random.rand(768).tolist()

# 搜索结果
search_result = client.search(
    collection_name="ai_articles",
    query_vector=query_vector,
    limit=5,
    query_filter=Filter(
        must=[
            FieldCondition(
                key="category",
                match=MatchValue(value="tech")
            )
        ]
    )
)

# 输出结果
for result in search_result:
    print(f"ID: {result.id}")
    print(f"分数: {result.score}")
    print(f"标题: {result.payload['title']}")
    print("---")
```

## 四、向量数据库性能优化

### 4.1 索引优化

**HNSW参数调优**：
HNSW（Hierarchical Navigable Small World）是最常用的向量索引算法，其性能取决于以下参数：

- **M（每个节点的连接数）**：M值越大，搜索精度越高，但内存消耗也越大。通常设置16-64。
- **efConstruction（构建时的搜索宽度）**：值越大，构建的索引质量越高，但构建时间越长。通常设置200-500。
- **ef（查询时的搜索宽度）**：值越大，查询精度越高，但延迟也越高。通常设置64-256。

**IVF（倒排索引）**：
IVF通过将向量聚类来加速搜索。关键参数：
- **nlist（聚类数量）**：通常设置为4*√N，其中N为向量总数
- **nprobe（搜索的聚类数量）**：值越大，搜索越精确，但延迟越高

### 4.2 查询优化

**批量查询**：
尽量使用批量查询而非单条查询，可以显著提高吞吐量：
```python
# 好的实践：批量查询
query_vectors = [[...], [...], [...]]
results = index.query(
    vectors=query_vectors,
    top_k=10
)

# 避免：循环单条查询
for qv in query_vectors:
    result = index.query(vector=qv, top_k=10)
```

**异步操作**：
使用异步API可以提高并发性能：
```python
import asyncio

async def async_search():
    tasks = [index.query_async(vector=v, top_k=10) for v in query_vectors]
    results = await asyncio.gather(*tasks)
    return results
```

### 4.3 存储优化

**向量量化**：
使用量化技术可以显著减少存储空间：
- **PQ（Product Quantization）**：将高维向量分割为多个子空间分别量化
- **SQ（Scalar Quantization）**：将浮点数转换为低精度整数

**维度降低**：
使用PCA或SVD降低向量维度：
```python
from sklearn.decomposition import PCA

# 降至256维
pca = PCA(n_components=256)
reduced_vectors = pca.fit_transform(vectors)
```

### 4.4 分区策略

**命名空间隔离**：
使用命名空间隔离不同类型的数据：
```python
# 按类别创建命名空间
index.upsert(vectors=vectors_a, namespace="category_a")
index.upsert(vectors=vectors_b, namespace="category_b")

# 查询时指定命名空间
results = index.query(vector=query, namespace="category_a")
```

**分片策略**：
大规模数据时使用分片：
```python
# 创建多个分片索引
for shard_id in range(num_shards):
    index_name = f"shard_{shard_id}"
    pinecone.create_index(index_name, ...)
```

## 五、生产环境最佳实践

### 5.1 高可用架构

**多区域部署**：
```python
# Pinecone多区域配置
pinecone.init(
    api_key="...",
    environment={
        "us-west1": {...},
        "eu-west1": {...},
        "ap-south1": {...}
    }
)

# 使用地理路由
index = pinecone.Index("us-west1-gcp-xxx")
```

**数据复制**：
```python
# Weaviate数据复制配置
client.schema.create_class({
    "class": "Article",
    "replicationFactor": 3,
    "shardingFactor": 2
})
```

### 5.2 安全配置

**访问控制**：
```python
# Pinecone API密钥管理
pinecone.init(
    api_key=os.environ["PINECONE_API_KEY"],
    environment=os.environ["PINECONE_ENV"]
)

# 使用IAM角色
# 在生产环境中使用AWS IAM或GCP Service Account
```

**数据加密**：
```python
# Milvus TLS配置
connections.connect(
    host="localhost",
    port="19530",
    secure=True,
    ssl_cert_path="/path/to/cert.pem"
)
```

### 5.3 监控与告警

**关键指标监控**：
```python
# 监控脚本示例
import time
from prometheus_client import start_http_server, Gauge

query_latency = Gauge('vector_query_latency', 'Query latency in ms')
query_throughput = Gauge('vector_query_throughput', 'Queries per second')
index_size = Gauge('vector_index_size', 'Index size in MB')

def monitor_metrics():
    while True:
        # 获取索引统计
        stats = index.describe_index_stats()
        
        # 更新指标
        index_size.set(stats['vector_count'] * 1024 / 8 / 1024 / 1024)
        
        time.sleep(60)

start_http_server(8000)
monitor_metrics()
```

### 5.4 备份与恢复

**Pinecone备份**：
```python
# 导出数据
export_job = index.export_data(
    format="json",
    destination="s3://bucket/backup/"
)

# 等待完成
while export_job.status != "completed":
    time.sleep(10)
    export_job = index.get_export_job(export_job.id)

# 恢复数据
index.import_data("s3://bucket/backup/")
```

## 六、向量数据库在AI应用中的高级应用

### 6.1 LLM应用架构

**RAG系统架构**：
```python
class RAGSystem:
    def __init__(self, vector_db, llm):
        self.vector_db = vector_db
        self.llm = llm
    
    def retrieve(self, query, top_k=5):
        # 获取查询向量
        query_embedding = self.llm.get_embedding(query)
        
        # 向量检索
        results = self.vector_db.search(
            query_vector=query_embedding,
            top_k=top_k
        )
        
        # 构建上下文
        context = "\n\n".join([
            r['content'] for r in results
        ])
        
        return context
    
    def generate(self, query, context):
        # 构建Prompt
        prompt = f"""基于以下上下文回答问题：
        
        上下文：
        {context}
        
        问题：{query}
        
        回答："""
        
        # 生成回答
        response = self.llm.generate(prompt)
        
        return response
    
    def answer(self, query):
        # 完整RAG流程
        context = self.retrieve(query)
        response = self.generate(query, context)
        return response
```

### 6.2 多模态应用

**图像向量存储**：
```python
import torch
from transformers import CLIPModel, CLIPProcessor
from PIL import Image

# 加载CLIP模型
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

def embed_image(image_path):
    image = Image.open(image_path)
    inputs = processor(images=image, return_tensors="pt")
    
    with torch.no_grad():
        image_embedding = model.get_image_features(**inputs)
    
    return image_embedding.numpy().flatten().tolist()

def embed_text(text):
    inputs = processor(text=[text], return_tensors="pt")
    
    with torch.no_grad():
        text_embedding = model.get_text_features(**inputs)
    
    return text_embedding.numpy().flatten().tolist()

# 存储图像向量
image_embedding = embed_image("photo.jpg")
index.upsert(
    vectors=[("img_001", image_embedding)],
    metadatas=[{"type": "image", "path": "photo.jpg"}]
)
```

### 6.3 推荐系统

**协同过滤向量**：
```python
class RecommenderSystem:
    def __init__(self, user_collection, item_collection):
        self.user_vectors = user_collection
        self.item_vectors = item_collection
    
    def get_user_embeddings(self, user_id):
        result = self.user_vectors.get(ids=[user_id])
        return result['vectors'][0]
    
    def recommend(self, user_id, top_k=10):
        # 获取用户向量
        user_embedding = self.get_user_embeddings(user_id)
        
        # 查找相似商品
        results = self.item_vectors.search(
            query_vector=user_embedding,
            top_k=top_k
        )
        
        return [
            {
                'item_id': r['id'],
                'score': r['score']
            }
            for r in results['matches']
        ]
```

### 6.4 异常检测

**向量异常检测**：
```python
import numpy as np

class AnomalyDetector:
    def __init__(self, collection):
        self.collection = collection
        self.threshold = 0.7
    
    def detect_anomalies(self, query_vector, top_k=100):
        # 获取参考向量
        results = self.collection.search(
            query_vector=query_vector,
            top_k=top_k
        )
        
        # 计算平均相似度
        scores = [r['score'] for r in results['matches']]
        avg_score = np.mean(scores)
        
        # 判断是否异常
        is_anomaly = avg_score < self.threshold
        
        return {
            'is_anomaly': is_anomaly,
            'avg_similarity': avg_score,
            'threshold': self.threshold
        }
```

## 七、总结与展望

### 7.1 技术选型建议

**选择Pinecone的场景**：
- 需要托管服务，减少运维负担
- 企业级应用，需要高可用性
- 快速原型开发
- 与AWS生态系统集成

**选择Weaviate的场景**：
- 需要开源解决方案
- 需要混合搜索能力
- 需要知识图谱功能
- 已有现成的embedding模型

**选择Milvus的场景**：
- 超大规模数据（数十亿级）
- 需要GPU加速
- 需要云原生部署
- 需要多种索引类型

**选择Chroma的场景**：
- 原型开发和测试
- 小规模生产应用
- 本地AI应用
- 学习目的

**选择Qdrant的场景**：
- 追求极致性能
- 需要Rust生态集成
- 需要灵活的过滤功能

### 7.2 未来发展趋势

1. **云原生原生支持**：更多向量数据库将提供原生Kubernetes支持
2. **多模态向量融合**：支持文本、图像、音频等多种向量的统一管理
3. **边缘计算支持**：支持在边缘设备上进行向量计算和检索
4. **AI模型集成**：与AI训练流程更深度集成
5. **实时更新优化**：更好的实时索引更新能力

### 7.3 学习资源

**官方文档**：
- Pinecone文档：https://docs.pinecone.io
- Weaviate文档：https://weaviate.io/documentation
- Milvus文档：https://milvus.io/docs
- Chroma文档：https://docs.trychroma.com
- Qdrant文档：https://qdrant.tech/documentation

**实践建议**：
1. 先从Chroma或Pinecone开始，学习基本概念
2. 然后尝试Weaviate，了解混合搜索
3. 最后根据需求选择生产环境的数据库

---

**更新日志**：
- 2026-03-30: 初始版本创建（v1.0）