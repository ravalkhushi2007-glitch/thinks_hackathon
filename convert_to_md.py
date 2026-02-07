
import os

input_file = "all_project_code.txt"
output_file = "/Users/khushikaushalraval/.gemini/antigravity/brain/53807042-0ed4-40e4-bbe5-e710f65b6cbc/source_code.md"

with open(input_file, "r") as f:
    lines = f.readlines()

with open(output_file, "w") as out:
    out.write("# Complete Project Source Code\n\n")
    out.write("This document contains all key source files for the Placement Analytics System.\n\n")
    
    current_file = None
    code_block_open = False
    
    for line in lines:
        if line.startswith("DO_NOT_COPY_THIS_LINE___FILE: "):
            if code_block_open:
                out.write("```\n\n")
                code_block_open = False
            
            filename = line.split(": ")[1].strip()
            extension = filename.split(".")[-1]
            lang = "javascript"
            if extension == "py": lang = "python"
            if extension == "json": lang = "json"
            if extension == "md": lang = "markdown"
            if extension == "css": lang = "css"
            
            out.write(f"## {filename}\n")
            out.write(f"``` {lang}\n")
            code_block_open = True
        else:
            if code_block_open:
                out.write(line)

    if code_block_open:
        out.write("```\n")

print("Conversion complete.")
