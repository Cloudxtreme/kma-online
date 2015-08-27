#!/usr/bin/perl -w

use strict;
use lib 'pmodules/lib/perl5'; # You may need to change this path
use Archive::Zip;
use Spreadsheet::WriteExcel;
use JSON::Parse 'parse_json';
use Data::Dumper;

#open my $fh, '>', \my $binary or die "Failed to open filehandle: $!";

my ( $outfile ) = @ARGV;

my $invoiceJson = do { local $/; <STDIN> };

my $invoice = parse_json( $invoiceJson ) or die "JSON parse error: $!";

my $workbook = Spreadsheet::WriteExcel->new( $outfile ) or die "problem with invoice file creation: $!";

#my $ap_color   = $workbook->set_custom_color( 40, '#F79372' );
my $borderColor = $workbook->set_custom_color( 40, 81, 81, 81);

my %count;

if ( ref $invoice eq 'ARRAY' )
{
  foreach my $invoice ( @$invoice )
  {
    invoice_to_xls( $invoice, $workbook )
  }
}
elsif ( ref $invoice eq 'HASH' )
{
  invoice_to_xls( $invoice, $workbook );
}

$workbook->close();

print "Done.\n";

#return 0;

sub invoice_to_xls
{
  my ($invoiceRef, $workbook) = @_;
  my %invoice = %$invoiceRef;
  my %client = %{$invoice->{client}};
  
  my $invoiceName = $invoice{ invoiceNum };
  
  if ($count{ $invoiceName }++ > 0)
  {
    $invoiceName .= " ($count{$invoiceName})";
  }
  
  my $worksheet = $workbook->add_worksheet( $invoiceName );
  
  $worksheet->fit_to_pages(1);
  
  $worksheet->set_column(0, 9, 10);
  
  $worksheet->hide_gridlines(2);
  
  $worksheet->print_area('A:J');       # Columns A to J if rows have data
  
  my $titleFormat = $workbook->add_format( 
    align    => 'left',
    size     => 16,
    font     => 'Times New Roman',
    italic   => 1
  );
  
  my $boldTitleFormat = $workbook->add_format(
    bold     => 1,
    align    => 'right',
    size     => 21,
    font     => 'Arial'
  );
  
  my $subheaderFormat =  $workbook->add_format(
    align   => 'left',
    size    => 14,
    font    => 'Arial'
  );
  
  my $subheaderFormat_M =  $workbook->add_format(
    align   => 'left',
    size    => 14,
    font    => 'Arial'
  );
  
  my $subtitleFormatSmall = $workbook->add_format(
    align   => 'center',
    size    => 9,
    font    => 'Arial',
    border  => 1,
    border_color => $borderColor
  );
  
  my $blockHeaderFormat_M = $workbook->add_format(
    align   => 'center',
    size    => 14,
    font    => 'Arial',
    border  => 1,
    border_color => $borderColor
  );
  
  my $blockHeaderFormatBold_M = $workbook->add_format(
    align   => 'center',
    size    => 14,
    font    => 'Arial',
    border  => 1,
    bold    => 1,
    border_color => $borderColor
  );
  
  my $blockRowFormat_M = $workbook->add_format(
    align   => 'center',
    size    => 12,
    font    => 'Arial',
    left    => 1,
    right   => 1,
    bottom  => 1,
    text_wrap => 1,
    border_color => $borderColor
  );
  
  my $blockRowFormatRight_M = $workbook->add_format(
    align   => 'right',
    size    => 12,
    font    => 'Arial',
    left    => 1,
    right   => 1,
    bottom  => 1,
    text_wrap => 1,
    border_color => $borderColor
  );
  
  my $blockRowFormatLeft_M = $workbook->add_format(
    align   => 'left',
    size    => 12,
    font    => 'Arial',
    left    => 1,
    right   => 1,
    border_color => $borderColor
  );
  
  my $blockFooterFormat_M = $workbook->add_format(
    align   => 'center',
    size    => 12,
    font    => 'Arial',
    left    => 1,
    right   => 1,
    bottom  => 1,
    border_color => $borderColor
  );
  
  my $footerFormat_M = $workbook->add_format(
    align   => 'left',
    size    => 12,
    font    => 'Arial',
    text_wrap => 1
  );
  
  my $width = 10;
  
  my $row = 0;
  
  ###############################################################################
  # HEADER SECTION
  ###############################################################################
  
  $worksheet->merge_range( $row, 0, $row, 3, "K&M CONSTRUCTION, INC.", $titleFormat );
  $worksheet->merge_range( $row, 8, $row, 9, "Invoice", $boldTitleFormat );
  
  $row++;
  
  $worksheet->merge_range( $row, 0, $row, 3, "P.O. BOX 97", $subheaderFormat_M );
  $worksheet->write($row, 8, "DATE", $subtitleFormatSmall );
  $worksheet->write($row, 9, "INVOICE #", $subtitleFormatSmall );
  
  $row++;
  
  $worksheet->merge_range( $row, 0, $row, 3, "HAILEY, ID 83333-0097 ", $subheaderFormat_M );
  $worksheet->write($row, 8, $invoice{ date }, $subtitleFormatSmall );
  $worksheet->write($row, 9, $invoice{ invoiceNum }, $subtitleFormatSmall );
  
  $row += 2;
  
  ###############################################################################
  # "BILL TO" SECTION
  ###############################################################################
  
  $worksheet->merge_range( $row, 1, $row, 5, "Bill To", $blockHeaderFormat_M);
  
  $row++;
  
  if ($client{ company }) {
    $worksheet->merge_range( $row, 1, $row, 5, $client{ company }, $blockRowFormatLeft_M);
    $row++;
  }
  
  if ($client{ name }) {
    $worksheet->merge_range( $row, 1, $row, 5, $client{ name }, $blockRowFormatLeft_M);
    $row++;
  }
  
  if ($client{ addr1 }) {
    $worksheet->merge_range( $row, 1, $row, 5, $client{ addr1 }, $blockRowFormatLeft_M);
    $row++;
  }
  
  if ($client{ addr2 }) {
    $worksheet->merge_range( $row, 1, $row, 5, $client{ addr2 }, $blockRowFormatLeft_M);
    $row++;
  }
  
  if ($client{ cityState }) {
    $worksheet->merge_range( $row, 1, $row, 5, $client{ cityState }, $blockRowFormatLeft_M);
    $row++;
  }
  
  $worksheet->merge_range( $row, 1, $row, 5, "", $blockFooterFormat_M);
  $row += 2;
  
  ###############################################################################
  # "TERMS" AND "PROJECT" AND ITEM HEADERS SECTION
  ###############################################################################
  
  $worksheet->merge_range( $row, 5, $row, 6, "Terms", $blockHeaderFormat_M);
  $worksheet->merge_range( $row, 7, $row, 9, "Project", $blockHeaderFormat_M);
  
  $row++;
  
  $worksheet->merge_range( $row, 5, $row, 6, $invoice{ terms }, $blockFooterFormat_M);
  $worksheet->merge_range( $row, 7, $row, 9, $invoice{ project }, $blockFooterFormat_M);
  
  $row++;
  
  $worksheet->merge_range( $row, 0, $row, 2, "Item", $blockHeaderFormat_M);
  $worksheet->merge_range( $row, 3, $row, 7, "Description", $blockHeaderFormat_M);
  $worksheet->merge_range( $row, 8, $row, 9, "Amount", $blockHeaderFormat_M);
  
  $worksheet->repeat_rows(0, $row); # Repeat the header rows on printing.
  
  $row++;
  
  ###############################################################################
  # ITEM TABLE SECTION
  ###############################################################################
  
  my @sortedItems = sort { lc($$a{ name }) cmp lc($$b{ name }) } @{ $invoice{ items } };
  my $total = 0.0;
  
  foreach my $item ( @sortedItems ) {
    my %item = %$item;
    
    $worksheet->merge_range( $row, 0, $row, 2, $item{ name }, $blockRowFormat_M);
    $worksheet->merge_range( $row, 3, $row, 7, $item{ desc }, $blockRowFormat_M);
    $worksheet->merge_range( $row, 8, $row, 9, '$'.$item{ cost }, $blockRowFormatRight_M);
    
    $total += $item{ cost };
    
    $row++;
  }
  
  ###############################################################################
  # "TOTAL" AND FOOTER SECTION
  ###############################################################################
  $worksheet->merge_range( $row, 0, $row, 5, "", $blockHeaderFormat_M);
  $worksheet->merge_range( $row, 6, $row, 7, "TOTAL", $blockHeaderFormatBold_M);
  $worksheet->merge_range( $row, 8, $row, 9, '$'.$total, $blockHeaderFormatBold_M);
  
  $row++;
  
  $worksheet->merge_range( $row, 0, $row, 5, $invoice{ footer }, $footerFormat_M);	
  
  # $worksheet->write( $row, 0, "Area"      , $headerFormat );
  # $worksheet->write( $row, 1, "Pos"       , $headerFormat );
  # $worksheet->write( $row, 2, "Name"      , $headerFormat );
  # $worksheet->write( $row, 3, "Address"   , $headerFormat );
  # $worksheet->write( $row, 4, "Phone"     , $headerFormat );
  # $worksheet->write( $row, 5, "Vehicle"   , $headerFormat );
  # $worksheet->write( $row, 6, "Car #"     , $headerFormat );
  # $worksheet->write( $row, 7, "Miles"     , $headerFormat );
  # $worksheet->write( $row, 8, "Area Email", $headerFormat );
  # $row++;
  
  # my @sortedDistricts = sort { $$a{ sortOrder } <=> $$b{ sortOrder } } @{ $zone{ Districts } };
  
  # foreach my $district ( @sortedDistricts )
  # {
  #   my %district = %$district;
    
  #   $worksheet->merge_range( $row, 0, $row, $width, $district{ currentName } || $district{ originalName }, $headerFormat );
    
  #   my @sortedAreas = sort { $$a{ sortOrder } <=> $$b{ sortOrder } } @{ $district{ Areas } };
    
  #   $row++;
    
  #   foreach my $area ( @sortedAreas )
  #   {
  #     my %area = %$area;
      
  #     $area{ Vehicle } = ( $area{ currentVehicle } ) ? $area{ currentVehicle } : $area{ originalVehicle };
  #     $area{ House   } = ( $area{ currentHouse   } ) ? $area{ currentHouse   } : $area{ originalHouse   };
  
  #     my @sortedMissionaries = sort { $$a{ sortOrder } <=> $$b{ sortOrder } } @{ $area{ Missionaries } };
  #     my $numMissionaries = scalar @{ $area{ Missionaries } }; #Missionaries is an array, scalarising it give us the length
      
  #     #print "missionary: " . @{ $area{ Missionaries } }[0]->{ currentRole } . "; " . @{ $area{ Missionaries } }[0]->{ originalRole } . "\n";
  #     my $missionaryRole;
  #     if ( $sortedMissionaries[0] )
  #     {
  #       $missionaryRole = $sortedMissionaries[0]->{ currentRole } ? $sortedMissionaries[0]->{ currentRole } : $sortedMissionaries[0]->{originalRole};
  #     }
  #     else
  #     {
  #       $missionaryRole = 'none';
  #     }
      
  #     my $vAlignCentre;
  #     my $bottomBorder;
  
  #     if ( $posKey{ $missionaryRole } )
  #     {
  #       $vAlignCentre = $workbook->add_format(
  #         bg_color => $posKey{ $missionaryRole },
  #         valign => 'vcenter',
  #         bottom => 1
  #       );
        
  #       $bottomBorder = $workbook->add_format(
  #         bg_color => $posKey{ $missionaryRole },
  #         bottom => 1
  #       );
  #     }
  #     else
  #     {
  #       $vAlignCentre = $workbook->add_format(
  #         valign => 'vcenter',
  #         bottom => 1
  #       );
        
  #       $bottomBorder = $workbook->add_format(
  #         bottom => 1
  #       );
  #     }
      
  #     #print $area{ currentName } || $area{ originalName } . "\n";
  #     if($numMissionaries > 1)
  #     {
  #       $worksheet->merge_range( $row, 0, $row + ($numMissionaries-1), 0, $area{ currentName } || $area{ originalName }, $vAlignCentre );
  #     }
  #     else
  #     {
  #       $worksheet->write( $row, 0, $area{ currentName } || $area{ originalName }, $bottomBorder );
  #     }
      
  #     my $mRow = $row;
  #     my $count = 0;
  #     foreach my $missionary ( @sortedMissionaries )
  #     {
  #       my $mBottomBorder;
  #       my $blankFormat;
  #       my $position = $missionary->{ currentRole } ? $missionary->{ currentRole } : $missionary->{ originalRole };
        
  #       if ( $posKey{ $position } )
  #       {
  #         $mBottomBorder = $workbook->add_format(
  #           bg_color => $posKey{ $position },
  #           bottom => 1
  #         );
  #         $blankFormat = $workbook->add_format(
  #           bg_color => $posKey{ $position }
  #         );
  #       }
  #       else
  #       {
  #         $mBottomBorder = $workbook->add_format(
  #           bottom => 1
  #         );
  #         $blankFormat = $workbook->add_format();
  #       }
        
  #       $count++;
  #       my %missionary = %$missionary;
        
  #       $worksheet->write( $mRow, 1, $missionary{ currentRole } || $missionary{ originalRole }, ($count == $numMissionaries) ? $mBottomBorder : $blankFormat );
  #       $worksheet->write( $mRow, 2, $missionary{ displayName }, ($count == $numMissionaries) ? $mBottomBorder : $blankFormat );
        
  #       $mRow++;
  #     }
      
  #     if ( $numMissionaries > 1 )
  #     {
  #       $worksheet->merge_range( $row, 3, $row + ($numMissionaries-1), 3, $area{ House }->{ street }, $vAlignCentre);
  #       $worksheet->merge_range( $row, 4, $row + ($numMissionaries-1), 4, $area{ currentPhoneNumbers } || $area{ originalPhoneNumbers }, $vAlignCentre );
        
  #       if ( $area{ Vehicle } )
  #       {
  #         $worksheet->merge_range( $row, 5, $row + ($numMissionaries-1), 5, "Car", $vAlignCentre );
  #         $worksheet->merge_range( $row, 6, $row + ($numMissionaries-1), 6, $area{ Vehicle }->{ ccid } , $vAlignCentre );
  #         $worksheet->merge_range( $row, 7, $row + ($numMissionaries-1), 7, $area{ currentMiles } || $area{ originalMiles }  , $vAlignCentre );
  #       }
  #       else
  #       {
          
  #         $worksheet->merge_range( $row, 5, $row + ($numMissionaries-1), 5, "Bike", $vAlignCentre );
  #         $worksheet->merge_range( $row, 6, $row + ($numMissionaries-1), 6, "-"   , $vAlignCentre );
  #         $worksheet->merge_range( $row, 7, $row + ($numMissionaries-1), 7, "-"   , $vAlignCentre );
  #       }
  #       $worksheet->merge_range( $row, 8, $row + ($numMissionaries-1), 8, $area{ email }, $vAlignCentre );
  #     }
  #     else
  #     {
  #       $worksheet->write( $row, 3, $area{ House }->{ street }, $bottomBorder);
  #       $worksheet->write( $row, 4, $area{ currentPhoneNumbers } || $area{ originalPhoneNumbers }, $bottomBorder );
  #       if ( $area{ Vehicle } )
  #       {
  #         $worksheet->write( $row, 5, "Car", $vAlignCentre );
  #         $worksheet->write( $row, 6, $area{ Vehicle }->{ ccid } , $vAlignCentre );
  #         $worksheet->write( $row, 7, $area{ currentMiles } || $area{ originalMiles }  , $vAlignCentre );
  #       }
  #       else
  #       {
  #         $worksheet->write( $row, 5, $row + ($numMissionaries-1), 5, "Bike", $vAlignCentre );
  #         $worksheet->write( $row, 6, $row + ($numMissionaries-1), 6, "-"   , $vAlignCentre );
  #         $worksheet->write( $row, 7, $row + ($numMissionaries-1), 7, "-"   , $vAlignCentre );
  #       }
  #       $worksheet->write( $row, 8, $area{ email }, $vAlignCentre );
  #     }
      
  #     $row += $numMissionaries;
  #   }
  #}
  
}
