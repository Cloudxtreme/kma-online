/* This is a Cfunctions (version 0.28) generated header file.
   Cfunctions is a free program for extracting headers from C files.
   Get Cfunctions from 'http://www.lemoda.net/cfunctions/'. */

/* This file was generated with:
'cfunctions -g unicode -n unicode.c unicode-character-class.c' */
#ifndef CFH_UNICODE_H
#define CFH_UNICODE_H

/* From 'unicode.c': */

#line 6 "unicode.c"
#define UTF8_MAX_LENGTH 4
#define UNICODE_BAD_INPUT -1
#define UNICODE_SURROGATE_PAIR -2
#define UNICODE_NOT_SURROGATE_PAIR -3
#define UNICODE_BAD_UTF8 -4
#define UNICODE_EMPTY_INPUT -5

#line 22 "unicode.c"
int utf8_to_ucs2 (const unsigned char * input , const unsigned char ** end_ptr );

#line 67 "unicode.c"
int ucs2_to_utf8 (int ucs2 , unsigned char * utf8 );

#line 105 "unicode.c"
int surrogate_to_utf8 (int hi , int lo , unsigned char * utf8 );

#line 128 "unicode.c"
int unicode_chars_to_bytes (const unsigned char * utf8 , int n_chars );

#line 145 "unicode.c"
int unicode_count_chars (const unsigned char * utf8 );

#line 169 "unicode.c"

#ifdef TEST
void print_bytes (const unsigned char * bytes );

#line 191 "unicode.c"
void test_ucs2_to_utf8 (const unsigned char * input , int * count );

#endif /* def TEST */
/* From 'unicode-character-class.c': */

#line 10 "unicode-character-class.c"
int ucs2_is_kana (int ucs );

#line 20 "unicode-character-class.c"
int utf8_is_kana_chars (const unsigned char * utf8 , int len );

#endif /* CFH_UNICODE_H */
