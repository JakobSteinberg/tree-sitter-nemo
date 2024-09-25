(tl_doc_comment) @comment.block.documentation
(doc_comment) @comment.block.documentation
(line_comment) @comment
(block_comment) @comment.block
(base_kv) @keyword.directive
(prefix_kv) @keyword.directive
(prefix_ns) @namespace
(import_kv) @keyword.directive
(import
  predicate: (tag) @variable.other.member)
(export_kv) @keyword.directive
(export
  predicate: (tag) @variable.other.member)
(declare_kv) @keyword.directive
(output_kv) @keyword.directive
(output
  (tag) @variable.other.member)
(iri) @markup.link.url
(string) @string
(number) @constant.numeric
(predicate_tag
  (constant) @variable.other.member)
(constant) @constant.builtin
