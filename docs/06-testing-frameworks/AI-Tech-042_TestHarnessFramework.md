# Test Harness 框架完全指南

## 目录

1. [什么是 Test Harness](#什么是-test-harness)
2. [Harness 框架的核心组件](#harness-框架的核心组件)
3. [Harness 框架类型与架构模式](#harness-框架类型与架构模式)
4. [从零构建 Harness 框架](#从零构建-harness-框架)
5. [改造存量项目的实践步骤](#改造存量项目的实践步骤)
6. [Harness 框架的最佳实践](#harness-框架的最佳实践)
7. [常见问题与解决方案](#常见问题与解决方案)

---

## 什么是 Test Harness

### 定义

Test Harness（测试线束/测试 harness）是用于自动化测试的软件框架和工具集合。它提供了一种结构化的方式来：

- 执行测试用例
- 收集测试结果
- 管理测试数据
- 生成测试报告

### Harness vs 测试框架

| 特性 | Test Harness | 测试框架 |
|------|---------------|----------|
| 范围 | 完整的测试解决方案 | 测试运行的基础设施 |
| 功能 | 包含执行器、报告、CI集成 | 仅包含测试运行逻辑 |
| 复杂度 | 高 | 低 |
| 示例 | Selenium + TestNG + Maven | JUnit, pytest, Mocha |

### Harness 在 DevOps 中的角色

```
代码提交 → CI服务器 → 构建 → 单元测试 → Harness测试 → 部署 → 监控
                              ↑
                        Test Harness 验证
```

---

## Harness 框架的核心组件

### 1. 测试运行器 (Test Runner)

负责执行测试用例的生命周期。

**主流选择：**
- **Java**: TestNG, JUnit 5, Spock
- **Python**: pytest, unittest, nose2
- **JavaScript/TypeScript**: Jest, Mocha, Jasmine
- **Go**: testify, ginkgo

**核心功能：**
- 测试发现（自动识别测试文件）
- 测试执行（并行/串行）
- 测试过滤（按标签/名称筛选）
- 超时控制

### 2. 断言库 (Assertion Library)

验证测试结果的断言机制。

**对比：**

| 语言 | 内置 | 第三方推荐 |
|------|------|------------|
| Java | Assert | AssertJ, Hamcrest |
| Python | assert | pytest assertions |
| JavaScript | expect (Jest) | chai, should.js |

### 3. Mock/Stub 框架

隔离外部依赖，模拟不可用或不稳定的组件。

**常见工具：**
- **Java**: Mockito, PowerMock, WireMock
- **Python**: unittest.mock, responses, requests-mock
- **JavaScript**: jest.mock, sinon

### 4. 测试数据管理

- **Fixtures**: 测试前置条件的数据准备
- **Factories**: 测试数据的动态生成
- **Factorial Data**: 参数化测试

### 5. 报告生成器

- **Allure**: 跨语言，支持详细报告和历史趋势
- **Extent Reports**: HTML 报告，易于定制
- **JUnit XML**: CI/CD 标准格式

### 6. 浏览器/设备驱动

- **Web**: Selenium WebDriver, Playwright, Cypress
- **Mobile**: Appium, XCTest
- **API**: REST-assured, httpx, requests

---

## Harness 框架类型与架构模式

### 1. 线性脚本模式 (Linear Scripting)

最简单的模式，记录用户操作后回放。

**结构：**
```
TestCase1 → TestCase2 → TestCase3 → 报告
```

**优点：** 简单，快速上手
**缺点：** 难以维护，可重用性差

### 2. 模块化驱动模式 (Modular Driven)

将测试分解为独立模块，通过组合实现复杂场景。

**结构：**
```
├── LoginModule (登录模块)
├── SearchModule (搜索模块)
├── OrderModule (订单模块)
└── TestCase = Module A + Module B + Module C
```

### 3. 数据驱动模式 (Data Driven)

将测试数据与测试逻辑分离，支持参数化。

**架构：**
```
┌─────────────────────────────────────┐
│          Test Runner                │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│    Test Data (CSV/Excel/JSON)       │
│  ┌─────────┬─────────┬─────────┐   │
│  │  Data1  │  Data2  │  Data3  │   │
│  └─────────┴─────────┴─────────┘   │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│    Test Script (参数化)             │
└─────────────────────────────────────┘
```

**实现示例 (Python pytest):**
```python
import pytest
import csv

# 测试数据源
TEST_DATA = [
    {"username": "admin", "password": "admin123", "expected": "success"},
    {"username": "invalid", "password": "wrong", "expected": "fail"}
]

@pytest.mark.parametrize("data", TEST_DATA)
def test_login(data):
    result = login(data["username"], data["password"])
    assert result == data["expected"]
```

### 4. 关键字驱动模式 (Keyword Driven)

将操作抽象为关键字，降低测试编写门槛。

**关键字库：**
```
关键字: Click
实现: driver.find_element(By.ID, "submit").click()

关键字: Type
实现: element.send_keys(text)

关键字: AssertText
实现: assert element.text == expected
```

**测试用例格式：**
| 步骤 | 关键字 | 元素 | 值 |
|------|--------|------|-----|
| 1 | OpenBrowser | - | Chrome |
| 2 | Navigate | - | https://example.com |
| 3 | Type | username | admin |
| 4 | Click | submit | - |

**框架示例：**
- Robot Framework (Python)
- Katalon Studio
- Cypress 关键字模式

### 5. 混合驱动模式 (Hybrid)

结合数据驱动和关键字驱动的优点，是企业级最常用的模式。

**架构：**
```
┌────────────────────────────────────────────────────┐
│                 Hybrid Harness                      │
├────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌─────────────┐  ┌───────────┐ │
│  │ Keyword Lib │  │ Data Files  │  │ Test Case │ │
│  └──────────────┘  └─────────────┘  └───────────┘ │
├────────────────────────────────────────────────────┤
│              Core Engine (执行器)                   │
├────────────────────────────────────────────────────┤
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────────┐  │
│  │ Reporter│ │ Logger │ │Config  │ │  DB/Excel │  │
│  └────────┘ └────────┘ └────────┘ └────────────┘  │
└────────────────────────────────────────────────────┘
```

---

## 从零构建 Harness 框架

### Step 1: 技术栈选择

**推荐组合：**

| 场景 | 语言 | 框架 | 断言 | 报告 |
|------|------|------|------|------|
| Web UI 测试 | Java | TestNG | AssertJ | Allure |
| API 测试 | Python | pytest | pytest-assume | Allure |
| 全栈 JavaScript | TypeScript | Jest | expect | jest-html-reporter |
| 微服务测试 | Go | testify | assert | reportify |

**我们的选择（通用型）：**
- **核心框架**: TestNG (Java) 或 pytest (Python)
- **Web 驱动**: Selenium 4 + Playwright 备选
- **API 测试**: REST-assured (Java) / requests (Python)
- **报告**: Allure

### Step 2: 项目结构设计

**标准 Maven/Gradle 结构（Java）：**
```
harness-framework/
├── src/
│   ├── main/
│   │   └── java/
│   │       ├── config/          # 配置管理
│   │       ├── core/            # 核心引擎
│   │       ├── keywords/        # 关键字库
│   │       ├── utils/           # 工具类
│   │       └── pages/           # Page Object
│   ├── test/
│   │   ├── java/
│   │   │   ├── tests/           # 测试用例
│   │   │   ├── data/            # 测试数据
│   │   │   └── listeners/      # 监听器
│   │   └── resources/
│   │       ├── config.properties
│   │       └── testdata/
│   └── test-data/               # 外部数据文件
├── libs/                        # 自定义 JAR
├── drivers/                     # 浏览器驱动
├── reports/                     # 测试报告
├── pom.xml
└── README.md
```

**标准 pytest 结构（Python）：**
```
harness-framework/
├── tests/
│   ├── test_cases/              # 测试用例
│   ├── test_data/               # 测试数据
│   └── conftest.py             # pytest 配置
├── core/
│   ├── runner.py                # 运行器
│   ├── assertions.py            # 断言封装
│   ├── keywords/                # 关键字实现
│   └── logger.py                # 日志
├── pages/                       # Page Object
├── config/
│   ├── __init__.py
│   ├── config.py                # 配置
│   └── env.py                   # 环境配置
├── requirements.txt
└── pytest.ini
```

### Step 3: 核心引擎实现

#### 3.1 测试运行器核心 (TestNG)

```java
// core/BaseTest.java
public class BaseTest {
    protected WebDriver driver;
    protected Properties config;
    
    @BeforeClass
    public void setUp() {
        config = ConfigLoader.load("config.properties");
        driver = DriverFactory.createDriver(config.get("browser"));
        driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
    }
    
    @AfterClass
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
```

#### 3.2 配置管理

```java
// config/ConfigLoader.java
public class ConfigLoader {
    private static Properties properties = new Properties();
    
    public static Properties load(String fileName) {
        try (InputStream input = new FileInputStream(fileName)) {
            properties.load(input);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load config: " + fileName);
        }
        return properties;
    }
    
    public static String get(String key) {
        return properties.getProperty(key);
    }
}
```

#### 3.3 关键字实现示例

```java
// keywords/BaseKeywords.java
public class BaseKeywords {
    
    public void click(WebDriver driver, String locator) {
        findElement(driver, locator).click();
    }
    
    public void type(WebDriver driver, String locator, String text) {
        findElement(driver, locator).sendKeys(text);
    }
    
    public String getText(WebDriver driver, String locator) {
        return findElement(driver, locator).getText();
    }
    
    private WebElement findElement(WebDriver driver, String locator) {
        // 支持多种定位方式: id=xxx, xpath=xxx, css=xxx
        String[] parts = locator.split("=", 2);
        By by = getBy(parts[0], parts[1]);
        return driver.findElement(by);
    }
    
    private By getBy(String type, String value) {
        return switch (type.toLowerCase()) {
            case "id" -> By.id(value);
            case "xpath" -> By.xpath(value);
            case "css" -> By.cssSelector(value);
            case "name" -> By.name(value);
            case "class" -> By.className(value);
            default -> throw new IllegalArgumentException("Unknown locator: " + type);
        };
    }
}
```

### Step 4: Page Object 模式

**核心原则：**
- 每个页面一个类
- 页面元素定位器私有
- 公共方法返回 this（链式调用）
- 不在页面类中写断言

```java
// pages/LoginPage.java
public class LoginPage {
    private WebDriver driver;
    
    // 元素定位器（私有）
    private By usernameInput = By.id("username");
    private By passwordInput = By.id("password");
    private By submitButton = By.xpath("//button[@type='submit']");
    private By errorMessage = By.cssSelector(".error-message");
    
    public LoginPage(WebDriver driver) {
        this.driver = driver;
    }
    
    // 页面操作方法
    public LoginPage enterUsername(String username) {
        driver.findElement(usernameInput).sendKeys(username);
        return this;
    }
    
    public LoginPage enterPassword(String password) {
        driver.findElement(passwordInput).sendKeys(password);
        return this;
    }
    
    public DashboardPage clickSubmit() {
        driver.findElement(submitButton).click();
        return new DashboardPage(driver);
    }
    
    public String getErrorMessage() {
        return driver.findElement(errorMessage).getText();
    }
}
```

### Step 5: 数据驱动实现

**CSV 数据文件 (testdata/login.csv):**
```csv
username,password,expected_result,expected_message
admin,admin123,success,dashboard
invalid,wrong,fail,Invalid credentials
locked,locked123,fail,Account locked
```

**数据驱动测试：**
```java
// tests/LoginDataDrivenTest.java
public class LoginDataDrivenTest extends BaseTest {
    
    @DataProvider(name = "loginData")
    public Object[][] getData() {
        return CSVReader.read("testdata/login.csv");
    }
    
    @Test(dataProvider = "loginData")
    public void testLogin(String username, String password, 
                          String expectedResult, String expectedMessage) {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.navigateTo();
        
        if ("success".equals(expectedResult)) {
            DashboardPage dashboard = loginPage.enterUsername(username)
                                                .enterPassword(password)
                                                .clickSubmit();
            Assert.assertTrue(dashboard.isLoaded());
        } else {
            loginPage.enterUsername(username)
                     .enterPassword(password)
                     .clickSubmit();
            Assert.assertEquals(loginPage.getErrorMessage(), expectedMessage);
        }
    }
}
```

### Step 6: 报告集成

**Allure 集成 (pom.xml):**
```xml
<dependencies>
    <dependency>
        <groupId>io.qameta.allure</groupId>
        <artifactId>allure-testng</artifactId>
        <version>2.24.0</version>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-surefire-plugin</artifactId>
            <configuration>
                <argLine>
                    -javaagent:${settings.localRepository}/org/aspectj/aspectjweaver/1.9.7/aspectjweaver-1.9.7.jar
                </argLine>
            </configuration>
        </plugin>
    </plugins>
</build>
```

**测试用例添加 Allure 描述：**
```java
@Epic("Login Feature")
@Story("User Authentication")
@Feature("Login")
@Story("Successful Login")
@Test
public void testLogin() {
    // 测试代码
}
```

---

## 改造存量项目的实践步骤

### Phase 1: 评估与规划

#### 1.1 现有测试资产盘点

**清单模板：**

| 类型 | 数量 | 技术栈 | 维护状态 | 优先级 |
|------|------|--------|----------|--------|
| 手动测试用例 | 200+ | Excel/Word | 低 | 高 |
| Selenium 脚本 | 50+ | Java/旧版Selenium | 中 | 高 |
| JMeter 脚本 | 20 | JMeter 4 | 中 | 中 |
| Postman 集合 | 30+ | Postman | 高 | 高 |
| 性能测试 | 10 | Python脚本 | 低 | 低 |

#### 1.2 依赖分析

```bash
# 分析现有代码依赖
mvn dependency:tree > dependencies.txt
# 或
pip freeze > requirements.txt
```

#### 1.3 风险评估

| 风险项 | 影响 | 缓解措施 |
|--------|------|----------|
| 旧框架不兼容 | 高 | 渐进式迁移 |
| 关键业务逻辑 | 高 | 逐模块验证 |
| 时间窗口 | 中 | 分阶段实施 |
| 团队技能 | 中 | 培训+文档 |

### Phase 2: 基础设施搭建

#### 2.1 创建 Harness 框架项目

```bash
# 使用模板创建
git init harness-framework
cd harness-framework

# 创建目录结构
mkdir -p src/main/java/com/harness/{config,core,keywords,pages,utils}
mkdir -p src/test/java/com/harness/{tests,data,listeners}
mkdir -p src/test/resources/{config,testdata}
mkdir -p drivers reports test-output
```

#### 2.2 配置管理

**环境配置文件结构：**
```
config/
├── dev.properties      # 开发环境
├── staging.properties  # 预发布环境
├── prod.properties     # 生产环境
└── common.properties   # 通用配置
```

**配置加载逻辑：**
```java
public class EnvironmentManager {
    private static String env = System.getProperty("env", "dev");
    
    public static void init() {
        String configFile = String.format("config/%s.properties", env);
        ConfigLoader.load(configFile);
    }
}
```

### Phase 3: 增量迁移策略

#### 3.1 第一批：核心回归测试

**筛选原则：**
- 高业务价值（核心流程）
- 稳定不常变
- 覆盖重要路径

**迁移步骤：**
1. 在 Harness 中创建对应测试类
2. 使用 Page Object 重构元素定位
3. 保持断言逻辑不变
4. 并行运行对比结果
5. 确认一致后切换

**迁移示例：**

**Before (旧代码):**
```java
@Test
public void testLogin() {
    driver.get("http://example.com/login");
    driver.findElement(By.id("user")).sendKeys("admin");
    driver.findElement(By.id("pass")).sendKeys("123456");
    driver.findElement(By.xpath("//button")).click();
    Assert.assertTrue(driver.getCurrentUrl().contains("dashboard"));
}
```

**After (Harness):**
```java
@Test
public void testLogin() {
    LoginPage loginPage = new LoginPage(driver);
    loginPage.navigateTo()
             .enterUsername("admin")
             .enterPassword("123456")
             .clickSubmit();
             
    DashboardPage dashboard = new DashboardPage(driver);
    Assert.assertTrue(dashboard.isLoaded());
}
```

#### 3.2 第二批：API 测试迁移

**旧 Postman 迁移到 REST-assured：**

**Postman Collection:**
```json
{
  "name": "Get User",
  "request": {
    "method": "GET",
    "url": "{{baseUrl}}/api/users/1"
  }
}
```

**转换为 Java:**
```java
@Test
public void testGetUser() {
    given()
        .baseUri(config.getProperty("api.baseUrl"))
        .header("Authorization", "Bearer " + token)
    .when()
        .get("/api/users/1")
    .then()
        .statusCode(200)
        .body("id", equalTo(1))
        .body("name", notNullValue());
}
```

#### 3.3 第三批：数据驱动测试

**将 Excel 数据迁移为参数化测试：**

```python
# 旧: Excel 驱动
df = pd.read_excel("testdata.xlsx")
for row in df:
    test_login(row['username'], row['password'])

# 新: pytest 参数化
@pytest.mark.parametrize("username,password,expected", [
    ("admin", "admin123", "success"),
    ("invalid", "wrong", "fail")
])
def test_login(username, password, expected):
    result = login(username, password)
    assert result == expected
```

### Phase 4: CI/CD 集成

#### 4.1 Jenkins Pipeline

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'mvn clean compile'
            }
        }
        
        stage('Unit Tests') {
            steps {
                sh 'mvn test -Dtest=*UnitTest'
            }
        }
        
        stage('Harness Tests') {
            steps {
                sh 'mvn test -Dtest=*IntegrationTest -Denv=staging'
            }
            
            post {
                always {
                    allure includeProperties: false, 
                            results: [[path: 'target/allure-results']], 
                            reportBuildPolicy: 'ALWAYS'
                }
            }
        }
        
        stage('Deploy to Staging') {
            when { branch 'develop' }
            steps {
                sh './deploy.sh staging'
            }
        }
    }
}
```

#### 4.2 GitHub Actions

```yaml
name: Test Harness CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          
      - name: Run Tests
        run: mvn test
        
      - name: Upload Allure Report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: allure-report
          path: target/allure-report
```

---

## Harness 框架的最佳实践

### 1. 页面对象模式 (Page Object)

**DO:**
- 每个页面/组件一个类
- 元素定位器私有
- 返回 `this` 实现链式调用
- 封装页面操作

**DON'T:**
- 在 Page Object 中写断言
- 暴露 WebElement
- 混合多个页面逻辑

### 2. 测试数据管理

**原则：**
- 测试数据与代码分离
- 使用工厂模式生成动态数据
- 每个测试独立数据（避免相互依赖）
- 关键数据使用 UUID

**实现：**
```java
public class TestDataFactory {
    
    public static User createRandomUser() {
        return User.builder()
            .id(UUID.randomUUID().toString())
            .username("test_" + System.currentTimeMillis())
            .email("test" + System.currentTimeMillis() + "@test.com")
            .build();
    }
}
```

### 3. 并行执行

**TestNG 并行配置:**
```xml
<suite name="Parallel Suite" parallel="methods" thread-count="5">
    <test name="Parallel Tests">
        <classes>
            <class name="com.harness.tests.TestClass"/>
        </classes>
    </test>
</suite>
```

**pytest 并行 (pytest-xdist):**
```bash
pytest tests/ -n auto  # 自动检测 CPU 核心数
pytest tests/ -n 4     # 使用 4 个进程
```

### 4. 智能等待

**Anti-pattern（避免）:**
```java
Thread.sleep(5000);  // 硬编码等待
```

**Best Practice:**
```java
// Selenium 4 智能等待
driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);

// 显式等待
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
wait.until(ExpectedConditions.elementToBeClickable(By.id("submit")));

// Playwright 自动等待
page.click("#submit");  // 自动等待元素可点击
```

### 5. 报告与日志

**Allure 特性利用:**
```java
@Epic("订单模块")
@Feature("下单功能")
@Story("普通下单")
@Severity(SeverityLevel.CRITICAL)
@Link(name = "需求", url = "https://jira.example.com/REQ-123")
@Test
public void testCreateOrder() {
    // 测试步骤
    Allure.step("登录");
    Allure.step("加入购物车");
    Allure.step("提交订单");
}
```

---

## 常见问题与解决方案

### Q1: 如何处理登录态/会话？

**解决方案：**

```java
// 方式1: 使用 Cookie
@BeforeClass
public void login() {
    driver.get("https://example.com/login");
    // ... 执行登录
    Set<Cookie> cookies = driver.manage().getCookies();
    // 保存到文件或共享
}

@BeforeMethod
public void restoreSession() {
    // 恢复 Cookie
    for (Cookie cookie : cookies) {
        driver.manage().addCookie(cookie);
    }
}

// 方式2: 使用 API 获取 Token
public String getAuthToken() {
    Response response = given()
        .contentType("application/json")
        .body("{\"username\":\"admin\",\"password\":\"123\"}")
    .when()
        .post("/api/login");
    
    return response.jsonPath().getString("token");
}
```

### Q2: 旧测试需要外部服务怎么办？

**解决方案：WireMock**

```java
@BeforeEach
public void setupWireMock() {
    stubFor(get(urlEqualTo("/api/users/1"))
        .willReturn(aResponse()
            .withStatus(200)
            .withBody("{\"id\":1,\"name\":\"Test User\"}")));
}

@Test
public void testWithMock() {
    // 使用 mock 的 API
    userService.getUser(1);
}
```

### Q3: 如何实现跨浏览器测试？

**解决方案：TestNG 参数化**

```java
@DataProvider(name = "browsers")
public Object[][] browsers() {
    return new Object[][] {
        {"chrome", "latest"},
        {"firefox", "latest"},
        {"edge", "latest"}
    };
}

@Test(dataProvider = "browsers")
public void crossBrowserTest(String browser, String version) {
    WebDriver driver = DriverFactory.createDriver(browser, version);
    // 测试逻辑
}
```

### Q4: 测试失败如何快速定位？

**解决方案：自动截图**

```java
public class ScreenshotListener extends TestListenerAdapter {
    
    @Override
    public void onTestFailure(ITestResult result) {
        WebDriver driver = (WebDriver) result.getTestContext()
            .getAttribute("driver");
        
        if (driver != null) {
            TakesScreenshot screenshot = (TakesScreenshot) driver;
            File srcFile = screenshot.getScreenshotAs(OutputType.FILE);
            // 保存到报告目录
        }
    }
}
```

### Q5: 如何处理异步操作？

**解决方案：等待策略**

```javascript
// Playwright - 自动等待
await page.click('#submit');
await page.waitForSelector('.success-message');

// 显式等待条件
await page.waitForFunction(() => {
    return document.querySelector('.status').textContent === 'Completed';
}, { timeout: 10000 });
```

---

## 附录：快速启动命令

### Java (Maven)

```bash
# 初始化项目
mvn archetype:generate -DgroupId=com.harness -DartifactId=harness-framework \
    -DarchetypeArtifactId=maven-archetype-quickstart

# 运行测试
mvn test

# 生成报告
mvn allure:serve

# 并行运行
mvn test -Dparallel=methods -DthreadCount=5
```

### Python (pytest)

```bash
# 安装依赖
pip install -r requirements.txt

# 运行测试
pytest tests/ -v

# 生成 Allure 报告
pytest tests/ --alluredir=reports/allure-results
allure serve reports/allure-results

# 并行运行
pytest tests/ -n auto

# 按标签运行
pytest tests/ -m "smoke"
```

---

*文档版本: 1.0*
*更新时间: 2026-04-01*