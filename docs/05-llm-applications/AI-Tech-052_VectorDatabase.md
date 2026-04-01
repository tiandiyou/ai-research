# Vector Database 实战完全指南

> 2026-04-01 | 技术文档 | 预计阅读时间：26分钟

---

## 目录

1. [向量数据库概述](#向量数据库概述)
2. [核心概念](#核心概念)
3. [主流向量数据库](#主流向量数据库)
4. [实战操作](#实战操作)
5. [性能优化](#性能优化)
6. [应用场景](#应用场景)
7. [最佳实践](#最佳实践)

---

## 向量数据库概述

### 什么是向量数据库

向量数据库是专门存储和检索高维向量数据的数据库，核心用于：

- **语义搜索**：基于语义相似度而非关键词
- **相似性匹配**：找到最相似的数据
- **向量索引**：高效检索高维数据
- **AI 应用**：RAG、推荐系统、图像搜索

```python
# 向量数据库 vs 传统数据库
class Comparison:
    """向量数据库 vs 传统数据库"""
    
    TRADITIONAL = {
        "存储": "结构化数据/文档",
        "查询": "精确匹配/范围查询",
        "索引": "B树/哈希",
        "场景": "业务数据、事务处理"
    }
    
    VECTOR = {
        "存储": "高维向量 embedding",
        "查询": "相似性搜索",
        "索引": "HNSW/IVF/LSH",
        "场景": "语义搜索、推荐系统、AI"
    }
```

### 为什么需要向量数据库

| 场景 | 传统方案 | 向量数据库 |
|------|----------|------------|
| 语义搜索 | 关键词匹配 | 语义相似度 |
| 推荐系统 | 规则/协同过滤 | 向量相似度 |
| 图片搜索 | 标签/元数据 | 视觉向量 |
| RAG | 关键词检索 | 语义检索 |

---

## 核心概念

### 1. 向量 Embedding

```python
# 向量生成
class EmbeddingGenerator:
    """向量生成"""
    
    # 文本 embedding
    from sentence_transformers import SentenceTransformer
    
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    # 生成向量
    text = "这是一个测试文本"
    embedding = model.encode(text)
    # 输出: array([-0.123, 0.456, ...], dtype=float32)
    # 维度: 384 (all-MiniLM-L6-v2)
    
    # 批量生成
    texts = ["文本1", "文本2", "文本3"]
    embeddings = model.encode(texts)
    # 输出: array([[...], [...], [...]], dtype=float32)
    
    # 常见模型维度
    MODEL_DIMENSIONS = {
        "all-MiniLM-L6-v2": 384,
        "text-embedding-ada-002": 1536,
        "text-embedding-3-small": 1536,
        "text-embedding-3-large": 3072
    }
```

### 2. 相似度度量

```python
# 相似度度量
class SimilarityMetrics:
    """向量相似度度量"""
    
    # 余弦相似度 (最常用)
    COSINE = {
        "公式": "cos(θ) = A·B / (||A|| × ||B||)",
        "范围": [-1, 1],
        "特点": "考虑方向，适合文本"
    }
    
    # 欧氏距离
    EUCLIDEAN = {
        "公式": "√(Σ(Ai-Bi)²)",
        "范围": [0, +∞)",
        "特点": "考虑绝对距离"
    }
    
    # 点积
    DOT_PRODUCT = {
        "公式": "A·B",
        "范围": (-∞, +∞)",
        "特点": "计算简单，适合归一化向量"
    }

# 计算实现
import numpy as np

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def euclidean_distance(a, b):
    return np.linalg.norm(a - b)

def dot_product(a, b):
    return np.dot(a, b)
```

### 3. 索引类型

```python
# 向量索引类型
class IndexTypes:
    """向量索引类型"""
    
    # HNSW (Hierarchical Navigable Small World)
    HNSW = {
        "原理": "构建分层图结构",
        "优点": "高召回、高性能",
        "缺点": "内存占用大",
        "适用": "需要高召回场景"
    }
    
    # IVF (Inverted File)
    IVF = {
        "原理": "聚类后搜索",
        "优点": "内存占用小",
        "缺点": "召回率依赖聚类数",
        "适用": "大规模数据"
    }
    
    # LSH (Locality-Sensitive Hashing)
    LSH = {
        "原理": "哈希碰撞近似",
        "优点": "适合高维稀疏",
        "缺点": "召回率较低",
        "适用": "近似最近邻"
    }
    
    # PQ (Product Quantization)
    PQ = {
        "原理": "向量分块量化",
        "优点": "极大压缩",
        "缺点": "精度损失",
        "适用": "超大规模数据"
    }
```

---

## 主流向量数据库

### 1. Weaviate

```python
# Weaviate 使用
import weaviate

# 连接
client = weaviate.Client(
    url="http://localhost:8080",
    additional_headers={
        "X-OpenAI-Api-Key": "sk-..."
    }
)

# 定义 schema
schema = {
    "class": "Article",
    "description": "文章",
    "vectorizer": "text2vec-transformers",
    "moduleConfig": {
        "text2vec-transformers": {
            "vectorizeClassName": False
        }
    },
    "properties": [
        {"name": "title", "dataType": ["text"]},
        {"name": "content", "dataType": ["text"]},
        {"name": "category", "dataType": ["text"]}
    ]
}

# 创建 class
client.schema.create_class(schema)

# 添加数据
client.data_object.create(
    class_name="Article",
    data_object={
        "title": "Python 教程",
        "content": "Python 是一种高级编程语言...",
        "category": "编程"
    },
    vector=embedding  # 或自动生成
)

# 语义搜索
results = client.query.get(
    "Article",
    ["title", "content", "category"]
).with_near_text({
    "concepts": ["编程语言"]
}).with_limit(5).do()
```

### 2. Milvus

```python
# Milvus 使用
from pymilvus import connections, Collection, FieldSchema, CollectionSchema, DataType, utility

# 连接
connections.connect(host='localhost', port='19530')

# 定义 schema
fields = [
    FieldSchema(name="id", dtype=DataType.INT64, is_primary=True),
    FieldSchema(name="vector", dtype=DataType.FLOAT_VECTOR, dim=384),
    FieldSchema(name="text", dtype=DataType.VARCHAR, max_length=10000),
    FieldSchema(name="category", dtype=DataType.VARCHAR, max_length=100)
]

schema = CollectionSchema(fields=fields, description="文档集合")

# 创建 collection
collection = Collection(name="documents", schema=schema)

# 创建索引
index_params = {
    "index_type": "HNSW",
    "metric_type": "COSINE",
    "params": {"M": 16, "efConstruction": 256}
}

collection.create_index(field_name="vector", index_params=index_params)

# 插入数据
data = [
    [1, 2, 3],  # ids
    [embed1, embed2, embed3],  # vectors
    ["text1", "text2", "text3"],  # text
    ["cat1", "cat2", "cat3"]  # category
]

collection.insert(data)

# 搜索
search_params = {"metric_type": "COSINE", "params": {"ef": 64}}

results = collection.search(
    data=[query_embedding],
    anns_field="vector",
    param=search_params,
    limit=5,
    output_fields=["text", "category"]
)
```

### 3. Qdrant

```python
# Qdrant 使用
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from qdrant_client.http.models import Filter

# 连接
client = QdrantClient(host="localhost", port=6333)

# 创建 collection
client.recreate_collection(
    collection_name="documents",
    vectors_config=VectorParams(
        size=384,
        distance=Distance.COSINE
    )
)

# 插入数据
operations = []
for i, (vec, text) in enumerate(zip(embeddings, texts)):
    operations.append(
        PointStruct(
            id=i,
            vector=vec,
            payload={"text": text, "category": "tech"}
        )
    )

client.upsert(
    collection_name="documents",
    points=operations
)

# 搜索
results = client.search(
    collection_name="documents",
    query_vector=query_embedding,
    limit=5,
    with_payload=True
)
```

### 4. Chroma

```python
# Chroma 使用（轻量级）
import chroma
from chroma.config import Settings

# 创建 client
client = chroma.Client(Settings(
    persist_directory="./chroma_db",
    anonymized_telemetry=False
))

# 创建 collection
collection = client.create_collection(
    name="documents",
    metadata={"description": "文档集合"}
)

# 添加数据
collection.add(
    ids=["1", "2", "3"],
    embeddings=[embed1, embed2, embed3],
    metadatas=[{"text": "文档1"}, {"text": "文档2"}, {"text": "文档3"}],
    documents=["内容1", "内容2", "内容3"]
)

# 查询
results = collection.query(
    query_embeddings=[query_embedding],
    n_results=5
)

# 结果
# results = {
#     'ids': [['1', '2']],
#     'distances': [[0.1, 0.2]],
#     'metadatas': [[{...}, {...}]],
#     'documents': [['内容1', '内容2']]
# }
```

---

## 实战操作

### 1. RAG 场景

```python
# RAG 中的向量数据库
class RAGVectorStore:
    """RAG 向量存储"""
    
    def __init__(self):
        self.client = chroma.Client()
        self.collection = None
    
    def init_collection(self, name: str):
        """初始化 collection"""
        try:
            self.client.delete_collection(name)
        except:
            pass
        
        self.collection = self.client.create_collection(
            name=name,
            metadata={"hnsw:space": "cosine"}
        )
    
    def add_documents(self, documents: List[dict]):
        """添加文档"""
        from sentence_transformers import SentenceTransformer
        
        model = SentenceTransformer('all-MiniLM-L6-v2')
        
        texts = [doc["text"] for doc in documents]
        ids = [doc.get("id", str(i)) for i, doc in enumerate(documents)]
        metadatas = [doc.get("metadata", {}) for doc in documents]
        
        embeddings = model.encode(texts)
        
        self.collection.add(
            ids=ids,
            embeddings=embeddings.tolist(),
            metadatas=metadatas,
            documents=texts
        )
    
    def retrieve(self, query: str, top_k: int = 5) -> List[dict]:
        """检索"""
        from sentence_transformers import SentenceTransformer
        
        model = SentenceTransformer('all-MiniLM-L6-v2')
        query_embedding = model.encode([query]).tolist()[0]
        
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k
        )
        
        return [
            {
                "text": doc,
                "metadata": meta,
                "distance": dist
            }
            for doc, meta, dist in zip(
                results["documents"][0],
                results["metadatas"][0],
                results["distances"][0]
            )
        ]
    
    def add_chunk(self, text: str, chunk_id: str, metadata: dict):
        """添加单个 chunk"""
        from sentence_transformers import SentenceTransformer
        
        model = SentenceTransformer('all-MiniLM-L6-v2')
        embedding = model.encode([text]).tolist()[0]
        
        self.collection.add(
            ids=[chunk_id],
            embeddings=[embedding],
            metadatas=[metadata],
            documents=[text]
        )
```

### 2. 混合搜索

```python
# 混合搜索实现
class HybridSearch:
    """混合搜索：向量 + 关键词"""
    
    def __init__(self, vector_db, keyword_index):
        self.vector_db = vector_db
        self.keyword_index = keyword_index
    
    def search(self, query: str, top_k: int = 10, alpha: float = 0.5):
        """混合搜索
        
        alpha: 向量搜索权重 (1-alpha 为关键词权重)
        """
        # 1. 向量搜索
        vector_results = self.vector_db.search(query, top_k=top_k * 2)
        
        # 2. 关键词搜索
        keyword_results = self.keyword_index.search(query, top_k=top_k * 2)
        
        # 3. 结果融合 (RRF)
        combined = self.rrf_fusion(vector_results, keyword_results, alpha)
        
        return combined[:top_k]
    
    def rrf_fusion(self, results_a, results_b, alpha):
        """Reciprocal Rank Fusion"""
        scores = {}
        
        # A 结果评分
        for i, result in enumerate(results_a):
            doc_id = result["id"]
            scores[doc_id] = scores.get(doc_id, 0) + alpha * (1 / (i + 1))
        
        # B 结果评分
        for i, result in enumerate(results_b):
            doc_id = result["id"]
            scores[doc_id] = scores.get(doc_id, 0) + (1 - alpha) * (1 / (i + 1))
        
        # 排序
        sorted_results = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        
        return [doc_id for doc_id, score in sorted_results]
```

---

## 性能优化

### 1. 索引优化

```python
# 索引优化策略
class IndexOptimization:
    """索引优化"""
    
    # HNSW 参数调优
    HNSW_PARAMS = {
        "M": "每个节点的边数，越大召回越高，内存越大",
        "efConstruction": "构建时搜索宽度，越大索引质量越好，构建越慢",
        "ef": "搜索时搜索宽度，影响召回和延迟"
    }
    
    # 推荐配置
    RECOMMENDATIONS = {
        "高召回场景": {
            "M": 32,
            "efConstruction": 256,
            "ef": 64
        },
        "低延迟场景": {
            "M": 16,
            "efConstruction": 128,
            "ef": 32
        },
        "大规模场景": {
            "M": 8,
            "efConstruction": 64,
            "ef": 16
        }
    }
    
    @classmethod
    def get_config(cls, scenario: str) -> dict:
        return cls.RECOMMENDATIONS.get(scenario, cls.RECOMMENDATIONS["高召回场景"])
```

### 2. 批量操作

```python
# 批量操作优化
class BatchOptimization:
    """批量操作"""
    
    @staticmethod
    def batch_insert(client, data: List[dict], batch_size: int = 100):
        """批量插入"""
        
        for i in range(0, len(data), batch_size):
            batch = data[i:i + batch_size]
            
            # 批量处理
            client.upsert(
                collection_name="documents",
                points=[
                    PointStruct(
                        id=item["id"],
                        vector=item["embedding"],
                        payload=item.get("metadata", {})
                    )
                    for item in batch
                ]
            )
            
            print(f"已处理 {min(i + batch_size, len(data))}/{len(data)}")
    
    @staticmethod
    async def async_search(client, queries: List[str], top_k: int = 5):
        """异步搜索"""
        import asyncio
        
        from sentence_transformers import SentenceTransformer
        model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # 批量编码
        embeddings = model.encode(queries)
        
        # 并行搜索
        tasks = [
            client.search_async(
                collection_name="documents",
                query_vector=emb.tolist(),
                limit=top_k
            )
            for emb in embeddings
        ]
        
        results = await asyncio.gather(*tasks)
        return results
```

---

## 应用场景

### 1. RAG 应用

```python
# RAG 完整流程
class RAGApplication:
    """RAG 应用"""
    
    def __init__(self):
        # 向量存储
        self.vector_store = ChromaVectorStore()
        
        # LLM
        self.llm = OpenAI()
        
        # 文档加载器
        self.loader = DocumentLoader()
    
    def index_documents(self, file_path: str):
        """索引文档"""
        # 加载文档
        documents = self.loader.load(file_path)
        
        # 分块
        chunks = self.chunk_documents(documents)
        
        # 索引
        self.vector_store.add_documents(chunks)
    
    def query(self, question: str) -> str:
        # 1. 检索相关文档
        relevant_docs = self.vector_store.retrieve(question, top_k=5)
        
        # 2. 构建上下文
        context = "\n\n".join([doc["text"] for doc in relevant_docs])
        
        # 3. 生成回答
        prompt = f"""基于以下上下文回答问题。如果无法从上下文找到答案，请如实说明。

上下文：
{context}

问题：{question}

回答："""
        
        answer = self.llm.generate(prompt)
        
        return answer
```

### 2. 推荐系统

```python
# 向量推荐系统
class VectorRecommender:
    """向量推荐"""
    
    def __init__(self):
        self.client = QdrantClient(host="localhost")
        self.user_collection = "users"
        self.item_collection = "items"
    
    def recommend(self, user_id: str, top_k: int = 10) -> List[dict]:
        # 获取用户向量
        user_vector = self.get_user_embedding(user_id)
        
        # 向量搜索
        results = self.client.search(
            collection_name=self.item_collection,
            query_vector=user_vector,
            limit=top_k,
            with_payload=True
        )
        
        return [
            {
                "item_id": r.id,
                "score": 1 - r.score,  # 距离转相似度
                "payload": r.payload
            }
            for r in results
        ]
```

---

## 最佳实践

### 1. 数据处理

```python
# 数据处理最佳实践
DataProcessing = {
    "分块策略": "建议 512-1024 字符，重叠 50-100 字符",
    "向量模型": "根据场景选择，文本用 sentence-transformers",
    "批量处理": "推荐批量插入，提升吞吐量",
    "去重": "使用 MinHashLSH 或 SimHash 进行去重"
}
```

### 2. 查询优化

```python
# 查询优化
QueryOptimization = {
    "预过滤": "先过滤再向量搜索，减少计算",
    "分页": "使用 cursor 进行分页，避免 offset 性能问题",
    "缓存": "相同查询使用缓存",
    "异步": "非实时场景使用异步搜索"
}
```

---

## 总结

向量数据库核心要点：

1. **场景**：语义搜索、RAG、推荐系统、图像搜索
2. **选型**：Weaviate（功能全）、Milvus（大规模）、Chroma（轻量）、Qdrant（易用）
3. **索引**：HNSW（高召回）、IVF（大规模）、PQ（压缩）
4. **优化**：批量操作、索引参数、查询优化
5. **实践**：分块策略、混合搜索、缓存

**推荐技术栈**：
- 小规模：Chroma
- 中规模：Qdrant / Weaviate
- 大规模：Milvus

---

*📅 更新时间：2026-04-01 | 版本：1.0*