# SOAPCR Source Analysis
This document inventories the legacy SOAPCR generator source to guide a parity rebuild.
## Narrative Writer Functions
### writepcr (starts at line 31)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `chart_button` | `getCBelem` | 56 |

### writeIncident (starts at line 70)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `txtInc_date` | `getTXelem` | 78 |
| `txtInc_incident_num` | `getTXelem` | 79 |
| `txtInc_loc_address` | `getTXelem` | 103 |
| `txtInc_loc_room` | `getTXelem` | 104 |
| `txtInc_loc_city` | `getTXelem` | 105 |
| `txtInc_loc_state` | `getTXelem` | 106 |
| `txtInc_loc_zip` | `getTXelem` | 107 |
| `txtInc_loc_gpslat` | `getTXelem` | 108 |
| `txtInc_loc_gpslong` | `getTXelem` | 109 |
| `txtInc_loc_w3w` | `getTXelem` | 110 |
| `txtInc_time_incoming` | `getTXelem` | 175 |
| `txtInc_time_dispatched` | `getTXelem` | 176 |
| `txtInc_time_responding` | `getTXelem` | 177 |
| `txtInc_time_arrival` | `getTXelem` | 178 |
| `txtInc_time_contact` | `getTXelem` | 179 |
| `txtInc_time_transport` | `getTXelem` | 180 |
| `txtInc_time_destination` | `getTXelem` | 181 |
| `txtInc_time_bis` | `getTXelem` | 182 |
| `txtInc_time_qtrs` | `getTXelem` | 183 |
| `txtInc_time_cancelled` | `getTXelem` | 184 |
| `txtInc_time_other` | `getTXelem` | 185 |
| `txtInc_time_otherdesc` | `getTXelem` | 186 |
| `txtInc_apparatus` | `getTXelem` | 269 |
| `rbShift` | `getRBelem` | 270 |
| `txtShift` | `getTXelem` | 271 |
| `rbInc_response` | `getRBelem` | 272 |
| `ddlInc_ResponseCode` | `getDLelem` | 273 |
| `rbInc_transport` | `getRBelem` | 274 |
| `ddlInc_TransportCode` | `getDLelem` | 275 |
| `ddlInc_disposition` | `getDLelem` | 276 |
| `txtInc_disposition_other` | `getTXelem` | 277 |
| `txtInc_miles_responding` | `getTXelem` | 376 |
| `txtInc_miles_scene` | `getTXelem` | 377 |
| `txtInc_miles_destination` | `getTXelem` | 378 |
| `txtInc_miles_other` | `getTXelem` | 379 |
| `txtInc_miles_otherdesc` | `getTXelem` | 380 |

### writePatient (starts at line 422)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `txtPers_firstname` | `getTXelem` | 431 |
| `txtPers_middlename` | `getTXelem` | 432 |
| `txtPers_lastname` | `getTXelem` | 433 |
| `txtPers_phone1` | `getTXelem` | 434 |
| `txtPers_phone2` | `getTXelem` | 435 |
| `txtPers_bd_month` | `getTXelem` | 436 |
| `txtPers_bd_day` | `getTXelem` | 437 |
| `txtPers_bd_year` | `getTXelem` | 438 |
| `txtPers_loc_address` | `getTXelem` | 515 |
| `txtPers_loc_room` | `getTXelem` | 516 |
| `txtPers_loc_city` | `getTXelem` | 517 |
| `txtPers_loc_state` | `getTXelem` | 518 |
| `txtPers_loc_zip` | `getTXelem` | 519 |

### writeInsurance (starts at line 559)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `txtIns_company` | `getTXelem` | 568 |
| `ddlIns_type` | `getDLelem` | 569 |
| `txtIns_policy` | `getTXelem` | 570 |
| `txtIns_group` | `getTXelem` | 571 |
| `txtIns_social` | `getTXelem` | 572 |
| `txtIns_insured` | `getTXelem` | 573 |
| `ddlIns_insured_relation` | `getDLelem` | 574 |
| `rbIns_work` | `getRBelem` | 575 |

### writeDispatch (starts at line 646)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `txtInc_apparatus` | `getTXelem` | 653 |
| `rbShift` | `getRBelem` | 659 |
| `txtShift` | `getTXelem` | 666 |
| `rbInc_response` | `getRBelem` | 673 |
| `ddlInc_ResponseCode` | `getDLelem` | 674 |
| `txtRespondsTo` | `getTXelem` | 682 |

### writeSubj (starts at line 694)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `txtChiefComplaint` | `getTXelem` | 707 |
| `cbNoChief` | `getCBelem` | 713 |
| `txtPtClaims` | `getTXelem` | 722 |
| `txtOnset` | `getTXelem` | 730 |
| `txtProvokes` | `getTXelem` | 735 |
| `txtQuality` | `getTXelem` | 740 |
| `txtRadiates` | `getTXelem` | 745 |
| `txtSeverity` | `getTXelem` | 750 |
| `txtTime` | `getTXelem` | 755 |
| `txtHxSimilar` | `getTXelem` | 760 |
| `txtPastMedHx` | `getTXelem` | 806 |
| `txtRxMeds` | `getTXelem` | 814 |
| `cbOTCAspirin` | `getCBelem` | 824 |
| `cbOTCApap` | `getCBelem` | 825 |
| `cbOTCIbuprofen` | `getCBelem` | 826 |
| `txtOTCOther` | `getTXelem` | 827 |
| `cbNKDA` | `getCBelem` | 868 |
| `cbAllergiesPCN` | `getCBelem` | 869 |
| `cbAllergiesSulfa` | `getCBelem` | 870 |
| `txtAllergies` | `getTXelem` | 871 |
| `ddlHospital` | `getDLelem` | 912 |
| `ddlHospitalReason` | `getDLelem` | 919 |

### writeObj (starts at line 929)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `txtAge` | `getTXelem` | 944 |
| `weightkg` | `getTXelem` | 945 |
| `weightlb` | `getTXelem` | 946 |
| `rbGender` | `getRBelem` | 947 |
| `ddlYears` | `getDLelem` | 955 |
| `rbMent` | `getRBelem` | 981 |
| `cbAlertPerson` | `getCBelem` | 986 |
| `cbAlertPlace` | `getCBelem` | 987 |
| `cbAlertTime` | `getCBelem` | 988 |
| `cbAlertSituation` | `getCBelem` | 989 |
| `rbMentNA` | `getRBelem` | 1021 |
| `txtGenImpression` | `getTXelem` | 1037 |
| `rblAirway` | `getRBelem` | 1044 |
| `rblBreathReg` | `getRBelem` | 1054 |
| `rblBreathRate` | `getRBelem` | 1055 |
| `rblBreathDepth` | `getRBelem` | 1056 |
| `rblBreathEffort` | `getRBelem` | 1057 |
| `txtCirculation` | `getTXelem` | 1086 |
| `cbCircNoBleeding` | `getCBelem` | 1092 |
| `rblSkinColor` | `getRBelem` | 1106 |
| `rblSkinTemp` | `getRBelem` | 1107 |
| `rblSkinDryness` | `getRBelem` | 1108 |
| `cbCapRefill` | `getCBelem` | 1109 |
| `txtSkinCapRefill` | `getTXelem` | 1134 |
| `rblPulsePosition` | `getRBelem` | 1150 |
| `rblPulseRate` | `getRBelem` | 1151 |
| `rblPulseRhythm` | `getRBelem` | 1152 |
| `rblPulseStrength` | `getRBelem` | 1153 |
| `pupilsLeft` | `getTXelem` | 1190 |
| `pupilsRight` | `getTXelem` | 1191 |
| `cbBS` | `getCBelem` | 1221 |
| `cbPROPnone` | `getCBelem` | 1416 |
| `txtPROP` | `getTXelem` | 1422 |

### write_ASSPEC_CHESTPAIN (starts at line 1513)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_chestpain_edema` | `getRBelem` | 1515 |
| `ASSPEC_chestpain_ascites` | `getRBelem` | 1516 |
| `ASSPEC_chestpain_JVD` | `getRBelem` | 1517 |
| `ASSPEC_chestpain_backpain` | `getRBelem` | 1518 |
| `ASSPEC_chestpain_doc` | `getTXelem` | 1519 |

### write_ASSPEC_HTN (starts at line 1523)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_HTN_medications` | `getRBelem` | 1525 |
| `ASSPEC_HTN_photophobia` | `getRBelem` | 1526 |
| `ASSPEC_HTN_cardiogenic` | `getRBelem` | 1527 |
| `ASSPEC_HTN_rigidity` | `getCBelem` | 1528 |
| `ASSPEC_HTN_brudzinski` | `getCBelem` | 1529 |
| `ASSPEC_HTN_kernig` | `getCBelem` | 1530 |

### write_ASSPEC_HYPERG (starts at line 1534)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_HYPERG_history` | `getRBelem` | 1536 |
| `ASSPEC_HYPERG_medications` | `getRBelem` | 1537 |
| `ASSPEC_HYPERG_oral` | `getTXelem` | 1539 |
| `ASSPEC_HYPERG_duration` | `getTXelem` | 1541 |
| `ASSPEC_HYPERG_dehydration` | `getRBelem` | 1542 |
| `ASSPEC_HYPERG_abpn` | `getRBelem` | 1543 |
| `ASSPEC_HYPERG_alcohol` | `getRBelem` | 1544 |
| `ASSPEC_HYPERG_seizures` | `getRBelem` | 1545 |
| `ASSPEC_HYPERG_infection` | `getRBelem` | 1546 |
| `ASSPEC_HYPERG_overdose` | `getRBelem` | 1547 |
| `ASSPEC_HYPERG_uremia` | `getRBelem` | 1548 |
| `ASSPEC_HYPERG_trauma` | `getRBelem` | 1549 |
| `ASSPEC_HYPERG_psych` | `getRBelem` | 1550 |
| `ASSPEC_HYPERG_shock` | `getRBelem` | 1551 |
| `ASSPEC_HYPERG_stroke` | `getRBelem` | 1552 |

### write_ASSPEC_HYPOG (starts at line 1556)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_HYPOG_history` | `getRBelem` | 1558 |
| `ASSPEC_HYPOG_medications` | `getRBelem` | 1559 |
| `ASSPEC_HYPOG_insulin` | `getTXelem` | 1561 |
| `ASSPEC_HYPOG_inschedule` | `getTXelem` | 1563 |
| `ASSPEC_HYPOG_oral` | `getTXelem` | 1565 |
| `ASSPEC_HYPOG_duration` | `getTXelem` | 1567 |
| `ASSPEC_HYPOG_nutrition` | `getTXelem` | 1569 |
| `ASSPEC_HYPOG_alcohol` | `getRBelem` | 1570 |
| `ASSPEC_HYPOG_seizures` | `getRBelem` | 1571 |
| `ASSPEC_HYPOG_infection` | `getRBelem` | 1572 |
| `ASSPEC_HYPOG_overdose` | `getRBelem` | 1573 |
| `ASSPEC_HYPOG_uremia` | `getRBelem` | 1574 |
| `ASSPEC_HYPOG_trauma` | `getRBelem` | 1575 |
| `ASSPEC_HYPOG_psych` | `getRBelem` | 1576 |
| `ASSPEC_HYPOG_shock` | `getRBelem` | 1577 |
| `ASSPEC_HYPOG_stroke` | `getRBelem` | 1578 |

### write_ASSPEC_ALT (starts at line 1582)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_ALT_home` | `getTXelem` | 1585 |
| `ASSPEC_ALT_time` | `getTXelem` | 1587 |

### write_ASSPEC_BITE (starts at line 1591)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_BITE_time` | `getTXelem` | 1594 |
| `ASSPEC_BITE_type` | `getTXelem` | 1596 |
| `ASSPEC_BITE_id` | `getTXelem` | 1598 |
| `ASSPEC_BITE_activity` | `getTXelem` | 1600 |
| `ASSPEC_BITE_site` | `getTXelem` | 1602 |

### write_ASSPEC_BURN (starts at line 1606)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_BURN_method` | `getTXelem` | 1609 |
| `ASSPEC_BURN_percentage` | `getTXelem` | 1611 |
| `ASSPEC_BURN_depth` | `getTXelem` | 1613 |
| `ASSPEC_BURN_location` | `getTXelem` | 1615 |
| `ASSPEC_BURN_respiratory` | `getRBelem` | 1616 |
| `ASSPEC_BURN_doc` | `getTXelem` | 1617 |

### write_ASSPEC_CO (starts at line 1621)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_CO_environment` | `getTXelem` | 1624 |
| `ASSPEC_CO_type` | `getTXelem` | 1626 |
| `ASSPEC_CO_duration` | `getTXelem` | 1628 |
| `ASSPEC_CO_coreading` | `getTXelem` | 1630 |
| `ASSPEC_CO_coox` | `getTXelem` | 1632 |

### write_ASSPEC_HYPOT (starts at line 1636)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_HYPOT_environment` | `getTXelem` | 1639 |
| `ASSPEC_HYPOT_temperature` | `getTXelem` | 1641 |
| `ASSPEC_HYPOT_location` | `getTXelem` | 1643 |
| `ASSPEC_HYPOT_duration` | `getTXelem` | 1645 |
| `ASSPEC_HYPOT_warm` | `getTXelem` | 1647 |

### write_ASSPEC_HAZMAT (starts at line 1651)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_HAZMAT_exposure` | `getTXelem` | 1654 |
| `ASSPEC_HAZMAT_duration` | `getTXelem` | 1656 |
| `ASSPEC_HAZMAT_pta` | `getTXelem` | 1658 |
| `ASSPEC_HAZMAT_id` | `getTXelem` | 1660 |
| `ASSPEC_HAZMAT_decon` | `getTXelem` | 1662 |
| `ASSPEC_HAZMAT_doc` | `getTXelem` | 1663 |

### write_ASSPEC_HYPERT (starts at line 1667)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_HYPERT_ambient` | `getTXelem` | 1670 |
| `ASSPEC_HYPERT_body` | `getTXelem` | 1672 |
| `ASSPEC_HYPERT_cool` | `getTXelem` | 1674 |
| `ASSPEC_HYPERT_factors` | `getTXelem` | 1676 |

### write_ASSPEC_ABPN (starts at line 1680)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_ABPN_history` | `getTXelem` | 1683 |
| `ASSPEC_ABPN_surgeries` | `getTXelem` | 1685 |
| `ASSPEC_ABPN_nausea` | `getRBelem` | 1686 |
| `ASSPEC_ABPN_vomiting` | `getRBelem` | 1687 |
| `ASSPEC_ABPN_diarrhea` | `getRBelem` | 1688 |
| `ASSPEC_ABPN_fever` | `getRBelem` | 1689 |
| `ASSPEC_ABPN_pain` | `getRBelem` | 1690 |
| `ASSPEC_ABPN_trauma` | `getRBelem` | 1691 |
| `ASSPEC_ABPN_doc` | `getTXelem` | 1692 |

### write_ASSPEC_DEHYD (starts at line 1696)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_DEHYD_travel` | `getTXelem` | 1699 |
| `ASSPEC_DEHYD_frequency` | `getTXelem` | 1701 |
| `ASSPEC_DEHYD_diet` | `getTXelem` | 1703 |
| `ASSPEC_DEHYD_history` | `getTXelem` | 1705 |
| `ASSPEC_DEHYD_description` | `getTXelem` | 1707 |
| `ASSPEC_DEHYD_origin` | `getRBelem` | 1708 |
| `ASSPEC_DEHYD_temperature` | `getRBelem` | 1709 |

### write_ASSPEC_GI (starts at line 1713)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_GI_ulcers` | `getRBelem` | 1715 |
| `ASSPEC_GI_etoh` | `getRBelem` | 1716 |
| `ASSPEC_GI_description` | `getTXelem` | 1718 |
| `ASSPEC_GI_origin` | `getRBelem` | 1719 |

### write_ASSPEC_FLU (starts at line 1723)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_FLU_nystagmus` | `getRBelem` | 1725 |
| `ASSPEC_FLU_trauma` | `getTXelem` | 1727 |
| `ASSPEC_FLU_description` | `getTXelem` | 1729 |
| `ASSPEC_FLU_provokes` | `getTXelem` | 1731 |
| `ASSPEC_FLU_doc` | `getTXelem` | 1732 |

### write_ASSPEC_AMS (starts at line 1736)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_AMS_nystagmus` | `getRBelem` | 1738 |
| `ASSPEC_AMS_double` | `getRBelem` | 1739 |
| `ASSPEC_AMS_ataxia` | `getRBelem` | 1740 |
| `ASSPEC_AMS_origin` | `getRBelem` | 1741 |
| `ASSPEC_AMS_alcohol` | `getRBelem` | 1742 |
| `ASSPEC_AMS_seizures` | `getRBelem` | 1743 |
| `ASSPEC_AMS_infection` | `getRBelem` | 1744 |
| `ASSPEC_AMS_diabetes` | `getRBelem` | 1745 |
| `ASSPEC_AMS_overdose` | `getRBelem` | 1746 |
| `ASSPEC_AMS_uremia` | `getRBelem` | 1747 |
| `ASSPEC_AMS_trauma` | `getRBelem` | 1748 |
| `ASSPEC_AMS_psych` | `getRBelem` | 1749 |
| `ASSPEC_AMS_shock` | `getRBelem` | 1750 |
| `ASSPEC_AMS_stroke` | `getRBelem` | 1751 |

### write_ASSPEC_CVA (starts at line 1755)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_CVA_aphasia` | `getRBelem` | 1757 |
| `ASSPEC_CVA_dysphasia` | `getRBelem` | 1758 |
| `ASSPEC_CVA_droop` | `getRBelem` | 1759 |
| `ASSPEC_CVA_drift` | `getRBelem` | 1760 |
| `ASSPEC_CVA_nystagmus` | `getRBelem` | 1761 |
| `ASSPEC_CVA_time` | `getTXelem` | 1763 |

### write_ASSPEC_SYNC (starts at line 1767)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_SYNC_events` | `getTXelem` | 1770 |
| `ASSPEC_SYNC_history` | `getTXelem` | 1772 |
| `ASSPEC_SYNC_trauma` | `getRBelem` | 1773 |
| `ASSPEC_SYNC_vertigo` | `getRBelem` | 1774 |
| `ASSPEC_SYNC_seizure` | `getRBelem` | 1775 |
| `ASSPEC_SYNC_fluid` | `getRBelem` | 1776 |

### write_ASSPEC_SZ (starts at line 1780)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_SZ_history` | `getRBelem` | 1782 |
| `ASSPEC_SZ_compliant` | `getRBelem` | 1783 |
| `ASSPEC_SZ_aura` | `getRBelem` | 1784 |
| `ASSPEC_SZ_oral` | `getRBelem` | 1785 |
| `ASSPEC_SZ_incontinence` | `getRBelem` | 1786 |
| `ASSPEC_SZ_rigidity` | `getCBelem` | 1787 |
| `ASSPEC_SZ_brudzinski` | `getCBelem` | 1788 |
| `ASSPEC_SZ_kernig` | `getCBelem` | 1789 |
| `ASSPEC_SZ_activity` | `getTXelem` | 1791 |
| `ASSPEC_SZ_postictal` | `getTXelem` | 1793 |

### write_ASSPEC_OB (starts at line 1797)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_OB_contractions` | `getTXelem` | 1800 |
| `ASSPEC_OB_timing` | `getTXelem` | 1802 |
| `ASSPEC_OB_water` | `getRBelem` | 1803 |
| `ASSPEC_OB_amniotic` | `getTXelem` | 1805 |
| `ASSPEC_OB_gravida` | `getTXelem` | 1807 |
| `ASSPEC_OB_para` | `getTXelem` | 1809 |
| `ASSPEC_OB_duedate` | `getTXelem` | 1811 |
| `ASSPEC_OB_problems` | `getTXelem` | 1813 |
| `ASSPEC_OB_prenatal` | `getTXelem` | 1815 |
| `ASSPEC_OB_social` | `getTXelem` | 1817 |

### write_ASSPEC_BIRTH (starts at line 1821)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_BIRTH_duedate` | `getTXelem` | 1824 |
| `ASSPEC_BIRTH_birthtime` | `getTXelem` | 1826 |
| `ASSPEC_BIRTH_presentation` | `getTXelem` | 1828 |
| `ASSPEC_BIRTH_sex` | `getRBelem` | 1829 |
| `ASSPEC_BIRTH_cord` | `getTXelem` | 1831 |
| `ASSPEC_BIRTH_placenta` | `getRBelem` | 1832 |
| `ASSPEC_BIRTH_meconium` | `getRBelem` | 1833 |
| `ASSPEC_BIRTH_1activity` | `getRBelem` | 1837 |
| `ASSPEC_BIRTH_1pulse` | `getRBelem` | 1838 |
| `ASSPEC_BIRTH_1grimace` | `getRBelem` | 1839 |
| `ASSPEC_BIRTH_1appearance` | `getRBelem` | 1840 |
| `ASSPEC_BIRTH_1respiration` | `getRBelem` | 1841 |
| `ASSPEC_BIRTH_5activity` | `getRBelem` | 1845 |
| `ASSPEC_BIRTH_5pulse` | `getRBelem` | 1846 |
| `ASSPEC_BIRTH_5grimace` | `getRBelem` | 1847 |
| `ASSPEC_BIRTH_5appearance` | `getRBelem` | 1848 |
| `ASSPEC_BIRTH_5respiration` | `getRBelem` | 1849 |

### write_ASSPEC_VAG (starts at line 1859)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_VAG_possibility` | `getRBelem` | 1861 |
| `ASSPEC_VAG_duedate` | `getTXelem` | 1863 |
| `ASSPEC_VAG_period` | `getTXelem` | 1865 |
| `ASSPEC_VAG_volume` | `getTXelem` | 1867 |
| `ASSPEC_VAG_blood` | `getTXelem` | 1869 |
| `ASSPEC_VAG_history` | `getTXelem` | 1871 |
| `ASSPEC_VAG_trauma` | `getRBelem` | 1872 |
| `ASSPEC_VAG_abuse` | `getRBelem` | 1873 |

### write_ASSPEC_NPAIN (starts at line 1877)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_NPAIN_chronic` | `getRBelem` | 1879 |
| `ASSPEC_NPAIN_frequency` | `getTXelem` | 1881 |
| `ASSPEC_NPAIN_location` | `getTXelem` | 1883 |
| `ASSPEC_NPAIN_distribution` | `getTXelem` | 1885 |
| `ASSPEC_NPAIN_doc` | `getTXelem` | 1886 |

### write_ASSPEC_PSYCH (starts at line 1890)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_PSYCH_suicidal` | `getRBelem` | 1892 |
| `ASSPEC_PSYCH_plan` | `getTXelem` | 1894 |
| `ASSPEC_PSYCH_ability` | `getTXelem` | 1896 |
| `ASSPEC_PSYCH_depression` | `getRBelem` | 1897 |
| `ASSPEC_PSYCH_history` | `getRBelem` | 1898 |
| `ASSPEC_PSYCH_etoh` | `getRBelem` | 1899 |
| `ASSPEC_PSYCH_onset` | `getRBelem` | 1900 |
| `ASSPEC_PSYCH_compliant` | `getRBelem` | 1901 |

### write_ASSPEC_APNEA (starts at line 1905)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_APNEA_duration` | `getTXelem` | 1908 |
| `ASSPEC_APNEA_treatment` | `getTXelem` | 1910 |
| `ASSPEC_APNEA_history` | `getTXelem` | 1912 |

### write_ASSPEC_RESP (starts at line 1916)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_RESP_duration` | `getTXelem` | 1919 |
| `ASSPEC_RESP_treatment` | `getTXelem` | 1921 |
| `ASSPEC_RESP_history` | `getTXelem` | 1923 |
| `ASSPEC_RESP_intubations` | `getTXelem` | 1925 |
| `ASSPEC_RESP_JVD` | `getRBelem` | 1926 |
| `ASSPEC_RESP_reflex` | `getRBelem` | 1927 |
| `ASSPEC_RESP_edema` | `getRBelem` | 1928 |
| `ASSPEC_RESP_ascites` | `getRBelem` | 1929 |

### write_ASSPEC_SHOCK (starts at line 1933)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_SHOCK_JVD` | `getRBelem` | 1935 |

### write_ASSPEC_OD (starts at line 1939)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_OD_type` | `getTXelem` | 1942 |
| `ASSPEC_OD_id` | `getTXelem` | 1944 |
| `ASSPEC_OD_intention` | `getRBelem` | 1945 |
| `ASSPEC_OD_contact` | `getRBelem` | 1946 |

### write_ASSPEC_TRAUMA (starts at line 2070)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_TRAUMA_mechanism` | `getTXelem` | 2073 |
| `ASSPEC_TRAUMA_safety` | `getTXelem` | 2075 |
| `ASSPEC_TRAUMA_intentional` | `getRBelem` | 2076 |
| `ASSPEC_TRAUMA_doc` | `getTXelem` | 2077 |

### write_ASSPEC_NOSE (starts at line 2081)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_NOSE_hypert` | `getRBelem` | 2083 |
| `ASSPEC_NOSE_thinner` | `getRBelem` | 2084 |
| `ASSPEC_NOSE_cart` | `getRBelem` | 2085 |
| `ASSPEC_NOSE_trauma` | `getTXelem` | 2087 |

### write_ASSPEC_FEVER (starts at line 2091)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_FEVER_rigidity` | `getCBelem` | 2093 |
| `ASSPEC_FEVER_brudzinski` | `getCBelem` | 2094 |
| `ASSPEC_FEVER_kernig` | `getCBelem` | 2095 |

### write_ASSPEC_SEX (starts at line 2099)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_SEX_trauma` | `getTXelem` | 2102 |
| `ASSPEC_SEX_evidence` | `getTXelem` | 2104 |

### write_ASSPEC_ALLERGIC (starts at line 2108)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `ASSPEC_ALLERGY_hives` | `getRBelem` | 2110 |
| `ASSPEC_ALLERGY_red` | `getRBelem` | 2111 |
| `ASSPEC_ALLERGY_angio` | `getRBelem` | 2112 |
| `ASSPEC_ALLERGY_rhino` | `getRBelem` | 2113 |
| `ASSPEC_ALLERGY_cause` | `getTXelem` | 2115 |
| `ASSPEC_ALLERGY_history` | `getTXelem` | 2117 |

### writeAss (starts at line 2127)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `txtASSESS` | `getTXelem` | 2132 |
| `rbASSESS_severity` | `getRBelem` | 2133 |

### writeEnding (starts at line 5067)
| Field ID | Getter | Source line |
| --- | --- | --- |
| `endAuthor` | `getTXelem` | 5075 |
| `endTime` | `getTXelem` | 5076 |

