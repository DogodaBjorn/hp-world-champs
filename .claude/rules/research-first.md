# Research first

Never write TMDL properties, PBIR JSON fields, enum values, or theme keys from
memory. The Power BI file formats evolve monthly and misremembered fields fail
silently in Desktop.

Before writing any schema-bound content:

1. Read the `$schema` URL declared in the file you are editing (or a sibling file
   of the same type) and verify the property against it.
2. If no schema is reachable, check Microsoft Learn for the current PBIP/PBIR/TMDL
   documentation.
3. If still unverified, say so explicitly in the plan and choose the conservative
   option — never invent a plausible-looking property.

The same discipline applies to `pbir` CLI flags (check `pbir --help` output, not
memory) and DAX function signatures you have any doubt about.
