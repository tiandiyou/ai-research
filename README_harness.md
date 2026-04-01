# 🧪 Harness Framework

> 企业级自动化测试框架，从零构建指南 + 存量项目迁移方案

## 📖 文档导航

| 文档 | 说明 |
|------|------|
| [TEST-HARNESS-GUIDE.md](docs/TEST-HARNESS-GUIDE.md) | **核心指南**：Harness 框架完全手册 |
| [setup-harness.sh](setup-harness.sh) | 快速初始化脚本 |
| [README.md](README.md) | 本文件 |

## 🚀 快速开始

### 方式一：自动初始化（推荐）

```bash
# Java 项目
chmod +x setup-harness.sh
./setup-harness.sh java

# Python 项目
./setup-harness.sh python
```

### 方式二：手动创建

**Java (Maven):**
```bash
mvn archetype:generate -DgroupId=com.harness -DartifactId=harness-framework \
    -DarchetypeArtifactId=maven-archetype-quickstart
```

**Python (pytest):**
```bash
mkdir harness-framework && cd harness-framework
pip init
pip install pytest selenium
```

## 📚 学习路径

```
1. 基础概念
   └── 什么是 Test Harness → 核心组件 → 框架类型

2. 框架构建
   ├── 技术栈选择
   ├── 项目结构设计
   ├── 核心引擎实现
   ├── Page Object 模式
   └── 数据驱动 + 报告集成

3. 存量迁移
   ├── 评估与盘点
   ├── 基础设施搭建
   ├── 增量迁移策略
   └── CI/CD 集成

4. 最佳实践
   ├── 页面对象模式
   ├── 测试数据管理
   ├── 并行执行
   └── 智能等待
```

## 🛠️ 技术栈

| 层级 | 选项 |
|------|------|
| **测试运行器** | TestNG / JUnit 5 / pytest / Jest |
| **Web 自动化** | Selenium 4 / Playwright / Cypress |
| **API 测试** | REST-assured / requests / httpx |
| **Mock** | WireMock / Mockito / responses |
| **报告** | Allure / Extent Reports |
| **CI/CD** | Jenkins / GitHub Actions |

## 📁 目录结构

```
harness-framework/
├── docs/                      # 详细文档
│   └── TEST-HARNESS-GUIDE.md  # 完整指南
├── setup-harness.sh          # 初始化脚本
├── src/                      # Java 源码
│   ├── main/java/com/harness/
│   │   ├── config/           # 配置管理
│   │   ├── core/             # 核心引擎
│   │   ├── keywords/         # 关键字库
│   │   ├── pages/            # Page Object
│   │   └── utils/            # 工具类
│   └── test/
│       ├── java/             # 测试用例
│       └── resources/        # 配置&数据
├── tests/                    # Python 测试
├── config/                   # 配置文件
├── drivers/                  # 浏览器驱动
├── reports/                  # 测试报告
└── README.md
```

## 🔧 常用命令

```bash
# Java
mvn test                      # 运行测试
mvn allure:serve              # 查看报告
mvn test -Dparallel=methods   # 并行执行

# Python
pytest tests/ -v              # 运行测试
pytest tests/ -n auto         # 并行执行
allure serve reports/allure   # 查看报告
```

## 📊 特性

- ✅ **多框架支持**: TestNG / pytest / Jest
- ✅ **Page Object**: 完整实现
- ✅ **数据驱动**: CSV / Excel / JSON
- ✅ **并行执行**: 自动分配
- ✅ **Allure 报告**: 详细可视化
- ✅ **CI/CD 集成**: Jenkins / GitHub Actions

## 📄 许可证

MIT License - 欢迎贡献！

---

> 💡 详细使用请参阅 [TEST-HARNESS-GUIDE.md](docs/TEST-HARNESS-GUIDE.md)