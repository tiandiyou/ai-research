#!/bin/bash

# Harness Framework 快速初始化脚本
# 使用方法: ./setup-harness.sh [java|python]

set -e

LANGUAGE=${1:-java}

echo "🚀 初始化 Harness Framework ($LANGUAGE)..."

if [ "$LANGUAGE" = "java" ]; then
    echo "📦 创建 Java 项目结构..."
    
    mkdir -p src/main/java/com/harness/{config,core,keywords,pages,utils}
    mkdir -p src/test/java/com/harness/{tests,data,listeners}
    mkdir -p src/test/resources/{config,testdata}
    mkdir -p drivers reports test-output
    
    cat > pom.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.harness</groupId>
    <artifactId>harness-framework</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <name>Harness Framework</name>
    <description>Enterprise Test Automation Framework</description>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <selenium.version>4.18.0</selenium.version>
        <testng.version>7.9.0</testng.version>
        <allure.version>2.24.0</allure.version>
    </properties>

    <dependencies>
        <!-- Selenium -->
        <dependency>
            <groupId>org.seleniumhq.selenium</groupId>
            <artifactId>selenium-java</artifactId>
            <version>${selenium.version}</version>
        </dependency>

        <!-- TestNG -->
        <dependency>
            <groupId>org.testng</groupId>
            <artifactId>testng</artifactId>
            <version>${testng.version}</version>
            <scope>test</scope>
        </dependency>

        <!-- AssertJ -->
        <dependency>
            <groupId>org.assertj</groupId>
            <artifactId>assertj-core</artifactId>
            <version>3.25.1</version>
            <scope>test</scope>
        </dependency>

        <!-- REST Assured -->
        <dependency>
            <groupId>io.rest-assured</groupId>
            <artifactId>rest-assured</artifactId>
            <version>5.3.1</version>
            <scope>test</scope>
        </dependency>

        <!-- Allure -->
        <dependency>
            <groupId>io.qameta.allure</groupId>
            <artifactId>allure-testng</artifactId>
            <version>${allure.version}</version>
            <scope>test</scope>
        </dependency>

        <!-- Apache POI (Excel读取) -->
        <dependency>
            <groupId>org.apache.poi</groupId>
            <artifactId>poi-ooxml</artifactId>
            <version>5.2.5</version>
        </dependency>

        <!-- WebDriver Manager -->
        <dependency>
            <groupId>io.github.bonigarcia</groupId>
            <artifactId>webdrivermanager</artifactId>
            <version>5.7.0</version>
        </dependency>

        <!-- Log4j2 -->
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-core</artifactId>
            <version>2.22.1</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.11.0</version>
                <configuration>
                    <source>17</source>
                    <target>17</target>
                </configuration>
            </plugin>

            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.2.3</version>
                <configuration>
                    <suiteXmlFiles>
                        <suiteXmlFile>src/test/resources/testng.xml</suiteXmlFile>
                    </suiteXmlFiles>
                </configuration>
            </plugin>

            <plugin>
                <groupId>io.qameta.allure</groupId>
                <artifactId>allure-maven</artifactId>
                <version>2.12.0</version>
            </plugin>
        </plugins>
    </build>
</project>
EOF

    # 创建基础配置文件
    cat > src/test/resources/testng.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE suite SYSTEM "http://testng.org/testng-1.0.dtd">
<suite name="Harness Test Suite" parallel="methods" thread-count="5">
    <listeners>
        <listener class-name="com.harness.listeners.TestListener"/>
    </listeners>
    <test name="Regression Tests">
        <classes>
            <class name="com.harness.tests.BaseTest"/>
        </classes>
    </test>
</suite>
EOF

    cat > src/test/resources/config.properties << 'EOF'
# Browser Configuration
browser=chrome
headless=false
implicit.wait=10
explicit.wait=10
page.load.timeout=30

# Base URLs
base.url=https://example.com
api.base.url=https://api.example.com

# Credentials
username=admin
password=admin123

# Reporting
report.path=target/allure-results
screenshot.on.failure=true
EOF

    echo "✅ Java 项目初始化完成！"
    echo ""
    echo "下一步："
    echo "  1. mvn compile          # 编译项目"
    echo "  2. mvn test             # 运行测试"
    echo "  3. mvn allure:serve     # 查看报告"

elif [ "$LANGUAGE" = "python" ]; then
    echo "📦 创建 Python 项目结构..."
    
    mkdir -p tests/{test_cases,test_data,test_features}
    mkdir -p core/{runner,keywords,assertions,logger}
    mkdir -p pages
    mkdir -p config
    mkdir -p reports/{allure,html}
    mkdir -p drivers
    
    cat > requirements.txt << 'EOF'
# Core Testing
pytest==8.0.0
pytest-xdist==3.5.0
pytest-html==4.1.1
pytest-allure-adaptor==1.7.10

# Web Automation
selenium==4.18.0
playwright==1.41.0
webdriver-manager==4.0.1

# API Testing
requests==2.31.0
httpx==0.26.0

# Data Processing
openpyxl==3.1.2
pandas==2.2.0

# Reporting
allure-pytest==2.13.2

# Utilities
python-dotenv==1.0.0
PyYAML==6.0.1
loguru==0.7.2
EOF

    cat > pytest.ini << 'EOF'
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = -v --tb=short --alluredir=reports/allure
markers =
    smoke: Smoke tests
    regression: Regression tests
    api: API tests
    ui: UI tests
    slow: Slow running tests
EOF

    cat > config/config.py << 'EOF'
"""配置管理"""
import os
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
CONFIG_DIR = BASE_DIR / "config"

class Config:
    """全局配置"""
    
    # 环境
    ENV = os.getenv("TEST_ENV", "dev")
    
    # 浏览器
    BROWSER = os.getenv("BROWSER", "chrome")
    HEADLESS = os.getenv("HEADLESS", "false").lower() == "true"
    
    # 超时设置
    IMPLICIT_WAIT = 10
    EXPLICIT_WAIT = 10
    PAGE_LOAD_TIMEOUT = 30
    
    # URLs
    BASE_URL = os.getenv("BASE_URL", "https://example.com")
    API_BASE_URL = os.getenv("API_BASE_URL", "https://api.example.com")
    
    # 报告
    REPORT_PATH = BASE_DIR / "reports" / "allure"
    SCREENSHOT_ON_FAILURE = True
    
    @classmethod
    def load_env_file(cls):
        """加载环境配置文件"""
        env_file = CONFIG_DIR / f"{cls.ENV}.env"
        if env_file.exists():
            from dotenv import load_dotenv
            load_dotenv(env_file)

Config.load_env_file()
EOF

    echo "✅ Python 项目初始化完成！"
    echo ""
    echo "下一步："
    echo "  1. pip install -r requirements.txt  # 安装依赖"
    echo "  2. pytest                           # 运行测试"
    echo "  3. allure serve reports/allure      # 查看报告"

else
    echo "❌ 不支持的语言: $LANGUAGE"
    echo "支持: java, python"
    exit 1
fi

echo ""
echo "📁 项目结构:"
find . -type f -name "*.java" -o -name "*.py" -o -name "pom.xml" -o -name "*.txt" -o -name "*.ini" | head -20