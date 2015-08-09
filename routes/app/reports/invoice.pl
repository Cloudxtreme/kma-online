#!/usr/bin/perl -w

use strict;
use Excel::Writer::XLSX;
use JSON::Parse 'parse_json';
use Data::Dumper;

#open my $fh, '>', \my $binary or die "Failed to open filehandle: $!";

my ( $outfile ) = @ARGV;

my $zoneJson = do { local $/; <STDIN> };

my $zone = parse_json( $zoneJson ) or die "JSON parse error: $!";

my $workbook = Excel::Writer::XLSX->new( $outfile ) or die "problem with report creation: $!";

my $ap_color   = $workbook->set_custom_color( 40, '#F79372' );
my $zl1_color  = $workbook->set_custom_color( 41, '#72D6F7' );
my $zl2_color  = $workbook->set_custom_color( 41, '#72D6F7' );
my $dl_color   = $workbook->set_custom_color( 42, '#48F0B2' );
my $dt_color   = $workbook->set_custom_color( 43, '#48F0B2' );
my $stl1_color = $workbook->set_custom_color( 44, '#FFBACE' );
my $stl2_color = $workbook->set_custom_color( 45, '#FFBACE' );
my $vct_color  = $workbook->set_custom_color( 46, '#FFFDBA' );
my $tr_color   = $workbook->set_custom_color( 47, '#D3BAFF' );

my %posKey = 
(
  'AP'   => $ap_color  ,
  'ZL1'  => $zl1_color ,
  'ZL2'  => $zl2_color ,
  'DL'   => $dl_color  ,
  'DT'   => $dt_color  ,
  'STL1' => $stl1_color,
  'STL2' => $stl2_color,
  'VCT'  => $vct_color ,
  'TR'   => $tr_color
);

#AP 
#ZL1
#ZL2
#DL
#DT
#STL1
#STL2
#STLT
#VCT
#TR
#BP
#SC
#SA
#JC

my %count;

if ( ref $zone eq 'ARRAY' )
{
  foreach my $zone ( @$zone )
  {
    zone_to_xlsx( $zone, $workbook )
  }
}
elsif ( ref $zone eq 'HASH' )
{
  zone_to_xlsx( $zone, $workbook );
}

$workbook->close();

print "Done.\n";

#return 0;

sub zone_to_xlsx
{
  my ($zoneRef, $workbook) = @_;
  my %zone = %$zoneRef;
  
  my $zoneName = $zone{ currentName } || $zone{ originalName };
  
  if ($count{ $zoneName }++ > 0)
  {
    $zoneName .= " ($count{$zoneName})";
  }
  
  my $worksheet = $workbook->add_worksheet( $zoneName );
  
  my $titleFormat = $workbook->add_format( 
    border   => 1,
    align    => 'center',
    size     => 18
  );
  
  my $headerFormat =  $workbook->add_format(
    bold    => 1,
    align  => 'center',
    bottom => 1
  );
  
  my $width = 8;
  
  my $row = 0;
  
  $worksheet->merge_range( $row, 0, $row, $width, $zoneName . " Zone Roster", $titleFormat );
  
  $row++;
  
  $worksheet->write( $row, 0, "Area"      , $headerFormat );
  $worksheet->write( $row, 1, "Pos"       , $headerFormat );
  $worksheet->write( $row, 2, "Name"      , $headerFormat );
  $worksheet->write( $row, 3, "Address"   , $headerFormat );
  $worksheet->write( $row, 4, "Phone"     , $headerFormat );
  $worksheet->write( $row, 5, "Vehicle"   , $headerFormat );
  $worksheet->write( $row, 6, "Car #"     , $headerFormat );
  $worksheet->write( $row, 7, "Miles"     , $headerFormat );
  $worksheet->write( $row, 8, "Area Email", $headerFormat );
  $row++;
  
  my @sortedDistricts = sort { $$a{ sortOrder } <=> $$b{ sortOrder } } @{ $zone{ Districts } };
  
  foreach my $district ( @sortedDistricts )
  {
    my %district = %$district;
    
    $worksheet->merge_range( $row, 0, $row, $width, $district{ currentName } || $district{ originalName }, $headerFormat );
    
    my @sortedAreas = sort { $$a{ sortOrder } <=> $$b{ sortOrder } } @{ $district{ Areas } };
    
    $row++;
    
    foreach my $area ( @sortedAreas )
    {
      my %area = %$area;
      
      $area{ Vehicle } = ( $area{ currentVehicle } ) ? $area{ currentVehicle } : $area{ originalVehicle };
      $area{ House   } = ( $area{ currentHouse   } ) ? $area{ currentHouse   } : $area{ originalHouse   };
  
      my @sortedMissionaries = sort { $$a{ sortOrder } <=> $$b{ sortOrder } } @{ $area{ Missionaries } };
      my $numMissionaries = scalar @{ $area{ Missionaries } }; #Missionaries is an array, scalarising it give us the length
      
      #print "missionary: " . @{ $area{ Missionaries } }[0]->{ currentRole } . "; " . @{ $area{ Missionaries } }[0]->{ originalRole } . "\n";
      my $missionaryRole;
      if ( $sortedMissionaries[0] )
      {
        $missionaryRole = $sortedMissionaries[0]->{ currentRole } ? $sortedMissionaries[0]->{ currentRole } : $sortedMissionaries[0]->{originalRole};
      }
      else
      {
        $missionaryRole = 'none';
      }
      
      my $vAlignCentre;
      my $bottomBorder;
  
      if ( $posKey{ $missionaryRole } )
      {
        $vAlignCentre = $workbook->add_format(
          bg_color => $posKey{ $missionaryRole },
          valign => 'vcenter',
          bottom => 1
        );
        
        $bottomBorder = $workbook->add_format(
          bg_color => $posKey{ $missionaryRole },
          bottom => 1
        );
      }
      else
      {
        $vAlignCentre = $workbook->add_format(
          valign => 'vcenter',
          bottom => 1
        );
        
        $bottomBorder = $workbook->add_format(
          bottom => 1
        );
      }
      
      #print $area{ currentName } || $area{ originalName } . "\n";
      if($numMissionaries > 1)
      {
        $worksheet->merge_range( $row, 0, $row + ($numMissionaries-1), 0, $area{ currentName } || $area{ originalName }, $vAlignCentre );
      }
      else
      {
        $worksheet->write( $row, 0, $area{ currentName } || $area{ originalName }, $bottomBorder );
      }
      
      my $mRow = $row;
      my $count = 0;
      foreach my $missionary ( @sortedMissionaries )
      {
        my $mBottomBorder;
        my $blankFormat;
        my $position = $missionary->{ currentRole } ? $missionary->{ currentRole } : $missionary->{ originalRole };
        
        if ( $posKey{ $position } )
        {
          $mBottomBorder = $workbook->add_format(
            bg_color => $posKey{ $position },
            bottom => 1
          );
          $blankFormat = $workbook->add_format(
            bg_color => $posKey{ $position }
          );
        }
        else
        {
          $mBottomBorder = $workbook->add_format(
            bottom => 1
          );
          $blankFormat = $workbook->add_format();
        }
        
        $count++;
        my %missionary = %$missionary;
        
        $worksheet->write( $mRow, 1, $missionary{ currentRole } || $missionary{ originalRole }, ($count == $numMissionaries) ? $mBottomBorder : $blankFormat );
        $worksheet->write( $mRow, 2, $missionary{ displayName }, ($count == $numMissionaries) ? $mBottomBorder : $blankFormat );
        
        $mRow++;
      }
      
      if ( $numMissionaries > 1 )
      {
        $worksheet->merge_range( $row, 3, $row + ($numMissionaries-1), 3, $area{ House }->{ street }, $vAlignCentre);
        $worksheet->merge_range( $row, 4, $row + ($numMissionaries-1), 4, $area{ currentPhoneNumbers } || $area{ originalPhoneNumbers }, $vAlignCentre );
        
        if ( $area{ Vehicle } )
        {
          $worksheet->merge_range( $row, 5, $row + ($numMissionaries-1), 5, "Car", $vAlignCentre );
          $worksheet->merge_range( $row, 6, $row + ($numMissionaries-1), 6, $area{ Vehicle }->{ ccid } , $vAlignCentre );
          $worksheet->merge_range( $row, 7, $row + ($numMissionaries-1), 7, $area{ currentMiles } || $area{ originalMiles }  , $vAlignCentre );
        }
        else
        {
          
          $worksheet->merge_range( $row, 5, $row + ($numMissionaries-1), 5, "Bike", $vAlignCentre );
          $worksheet->merge_range( $row, 6, $row + ($numMissionaries-1), 6, "-"   , $vAlignCentre );
          $worksheet->merge_range( $row, 7, $row + ($numMissionaries-1), 7, "-"   , $vAlignCentre );
        }
        $worksheet->merge_range( $row, 8, $row + ($numMissionaries-1), 8, $area{ email }, $vAlignCentre );
      }
      else
      {
        $worksheet->write( $row, 3, $area{ House }->{ street }, $bottomBorder);
        $worksheet->write( $row, 4, $area{ currentPhoneNumbers } || $area{ originalPhoneNumbers }, $bottomBorder );
        if ( $area{ Vehicle } )
        {
          $worksheet->write( $row, 5, "Car", $vAlignCentre );
          $worksheet->write( $row, 6, $area{ Vehicle }->{ ccid } , $vAlignCentre );
          $worksheet->write( $row, 7, $area{ currentMiles } || $area{ originalMiles }  , $vAlignCentre );
        }
        else
        {
          $worksheet->write( $row, 5, $row + ($numMissionaries-1), 5, "Bike", $vAlignCentre );
          $worksheet->write( $row, 6, $row + ($numMissionaries-1), 6, "-"   , $vAlignCentre );
          $worksheet->write( $row, 7, $row + ($numMissionaries-1), 7, "-"   , $vAlignCentre );
        }
        $worksheet->write( $row, 8, $area{ email }, $vAlignCentre );
      }
      
      $row += $numMissionaries;
    }
  }
  
}
