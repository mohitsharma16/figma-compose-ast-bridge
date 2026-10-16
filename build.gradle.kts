plugins {
    kotlin("jvm") version "2.1.10"
    kotlin("plugin.serialization") version "2.1.10"
    application
}

kotlin {
    jvmToolchain(21)
}

group = "com.figmacompose"
version = "1.0.0"

repositories {
    mavenCentral()
}

dependencies {
    // Official JetBrains Kotlin Embeddable Compiler for PSI / AST parsing (KtFile, KtCallExpression, etc.)
    implementation("org.jetbrains.kotlin:kotlin-compiler-embeddable:2.1.10")
    // Square KotlinPoet for structured Kotlin source file emission alongside AST pretty-printing
    implementation("com.squareup:kotlinpoet:1.18.1")
    // Kotlinx Serialization for Figma REST / Plugin API JSON parsing and serialization
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.3")

    testImplementation(kotlin("test"))
}

application {
    mainClass.set("com.figmacompose.ast.MainKt")
}

tasks.test {
    useJUnitPlatform()
}
