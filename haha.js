const response = {
    "status": "success",
    "data": {
        "convertedCode": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"hello world\");\n    }\n}",
        "explanations": [
            "The JavaScript `console.log` function is equivalent to Java's `System.out.println` for printing to the console.",
            "A basic Java program requires a class with a `main` method to be executable."
        ],
        "warnings": [],
        "metadata": {
            "sourceLanguage": "javascript",
            "targetLanguage": "java",
            "preserveComments": true,
            "optimizeCode": false,
            "codeLength": 29,
            "conversionTime": 1796
        }
    }
};

// Extract and format the converted code
function formatConvertedCode(response) {
    if (response.status === "success" && response.data.convertedCode) {
        console.log("**Converted Code:**\n");
        console.log("```java\n" + response.data.convertedCode + "\n```");
        console.log("\n**Explanations:**");
        response.data.explanations.forEach((exp, index) => {
            console.log(`${index + 1}. ${exp}`);
        });

        console.log("\n**Metadata:**");
        console.table(response.data.metadata);
    } else {
        console.error("Conversion failed or invalid response.");
    }
}

// Call the function
formatConvertedCode(response);
