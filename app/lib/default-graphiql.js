const defaultQuery = `# Welcome to the Postcode Search GraphiQL interface.
#
# GraphiQL is an in-browser tool for writing, validating, and
# testing GraphQL queries.
#
# Type queries into this side of the screen, and you will see intelligent
# typeaheads aware of the current GraphQL type schema and live syntax and
# validation errors highlighted within the text.
#
# GraphQL queries typically start with a "{" character. Lines that starts
# with a # are ignored.
#
# For example:

{
  postcodes {
    # Get data on a single postcode:
    get(value: "DL7 9BG") {
      id
      active
      coordinates {
        lat
        lon
      }
      codes {
        cty
        ward
      }
      names {
        cty
        ward
      }
      stats {
        imd
      }
    }
    # Get autocomplete suggestions for a prefix term:
    suggest(prefix: "DL7 9") {
      id
    }
  }
}

# Keyboard shortcuts:
#
#   Auto Complete:  Ctrl-Space (or just start typing)
#
#  Prettify Query:  Shift-Ctrl-P (or press the prettify button above)
#
#     Merge Query:  Shift-Ctrl-M (or press the merge button above)
#
#       Run Query:  Ctrl-Enter (or press the play button above)
#`

export default defaultQuery