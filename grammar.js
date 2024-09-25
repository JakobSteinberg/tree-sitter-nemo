module.exports = grammar({
  name: 'nemo',

  extras: $ => [/\s/, $.line_comment, $.block_comment],

  word: $ => $.tag,

  rules: {
    source_file: $ => seq(optional($.tl_doc_comment), repeat(seq($.statement, '.'))),

    statement: $ => choice($.directive, $.fact, $.rule),

    directive: $ => choice($.base, $.prefix, $.import, $.export, $.declare, $.output),

    // the keywords are factored out, because of keyword detection
    base: $ => seq($.base_kv, $.iri),
    base_kv: $ => seq('@', 'base'),
    prefix: $ => seq($.prefix_kv, $.prefix_ns, $.iri),
    prefix_kv: $ => seq('@', 'prefix'),
    import: $ => seq($.import_kv, field('predicate', $.tag), ':-', field('config_map', $.map)),
    import_kv: $ => seq('@', 'import'),
    export: $ => seq($.export_kv, field('predicate', $.tag), ':-', field('config_map', $.map)),
    export_kv: $ => seq('@', 'export'),
    declare: $ => seq($.declare_kv, $.tag, '(', optional(seq($.name_type_pair, repeat(seq(',', $.name_type_pair)))), ')'),
    declare_kv: $ => seq('@', 'declare'),
    output: $ => seq($.output_kv, optional(seq($.tag, repeat(seq(',', $.tag))))),
    output_kv: $ => seq('@', 'output'),

    fact: $ => seq($.predicate_tag, '(', optional(seq($.expression, repeat(seq(',', $.expression)), optional(','))), ')'),

    rule: $ => seq($.atom, repeat(seq(',', $.atom)), optional(','), ':-', $.atom, repeat(seq(',', $.atom)), optional(',')),

    atom: $ => choice(
      $.fact,
      seq($.expression, /=|!=|<|<=|>|>=/, $.expression),
      seq('~', $.fact),
    ),

    map: $ => seq(field('map_tag', $.tag), '{', optional(seq($.key_value_pair, repeat(seq(',', $.key_value_pair)), optional(','))), '}'),

    tuple: $ => seq('(', choice(seq($.expression, repeat(seq(',', $.expression)), optional(',')),','), ')'),

    tag: $ => /[a-zA-Z0-9_-]+/,
    prefixed_tag: $ => seq($.prefix_ns, $.tag),
    predicate_tag: $ => $.constant,
    iri: $ => /<.*>/,
    string: $ => seq('"', repeat(/[^\x22\x5C\x0A\x0D]/), '"'),
    constant: $ => choice($.tag, $.prefixed_tag),
    number: $ => token(prec(2, /[0-9]+/)),
    universal: $ => /\?[a-zA-Z0-9_-]+/,
    existential: $ => /![a-zA-Z0-9_-]+/,
    arithmetic: $ => choice(
      prec.left(2, seq($.expression, '*', $.expression)),
      prec.left(2, seq($.expression, '/', $.expression)),
      prec.left(1, seq($.expression, '+', $.expression)),
      prec.left(1, seq($.expression, '-', $.expression)),
    ),
    function_term: $ => $.fact,

    name_type_pair: $ => seq($.tag, optional(seq(':', /any|string|int|double|float/))),

    key_value_pair: $ => seq($.expression, '=', $.expression),

    expression: $ => choice(
      $.number,
      $.constant,
      $.iri,
      $.string,
      $.universal,
      $.existential,
      $.tuple,
      $.arithmetic,
      $.function_term,
    ),

    // TODO: what are the actual allowed characters in prefix name spaces?
    prefix_ns: $ => /[a-zA-Z_-]*:/,

    // comments
    tl_doc_comment: $ => token(prec(2, repeat1(seq('%!', /.*/, /\s*/)))),

    doc_comment: $ => token(prec(2, repeat1(seq('%%%', /.*/, /\s*/)))),

    line_comment: $ => token(prec(1, seq('%', /.*/))),

    block_comment: $ => token(prec(1, seq('/*', /.*/, '*/'))),
  }
});
