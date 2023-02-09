# heat-calculation
## Performance-based approach for cooker location in flats
This tool calculates the distance at which is received a specific radiant heat flux.
### Why?
As a best practice, it is recommended to provide a separation distance of 1.8m between kitchen hob and internal escape routes within bedrooms/flats.
However, due to space constraints, it may not be possible to achieve this safe distance of 1.8m between. This tool determines the minimum distance for a tenable radiant heat flux.
### Fire scenario and assumptions
Fire is considered as a radiating panel, located above the cooking facilities (oven/hob). The bottom edge of the panel is assumed to be 0.9m above finished floor level (typical kitchen unit height), with a width of "**a**"m (kitchen unit width) and a height of "**b**"m (flame height).

Sprinklers are not considered when determining the **radiant heat from fire $Q$**, as the temperature of the heat source is assumed to be the maximum compartment temperature noted in BR 187, equating to a radiation intensity value of 168 kW/m².

The determination of **FED**, on the other hand, takes into account the sprinkler effects, as the convective heat from the fire is not accounted for (sprinklers are expected to cool fire gas).
### Acceptance criteria
***Exposure to heat radiation:*** The acceptance criteria used within this analysis are based on the tenability limits for exposure of skin to radiant heat from PD 7974-6 Table I.4:
- A threshold heat flux of 2.5kW/m² can be tolerated by a person for 30 seconds 
- A threshold heat flux of 10kW/m² can be tolerated by a person for 4 seconds 

***FED:*** The cumulated heat doses, received during evacuation from the room, will trigger skin pain when it reaches FED = 1. To allow for uncertainties in response of more sensitive occupants to skin pain, this tenability limit may be reduced to 0.5 (elderly people, children).
### Calculation of exposure to radiative heat
The radiant heat flux from a flame is given in PD 7974-1, by:
$$Q=\Phi.\varepsilon.\sigma.T^4$$
Where:
- $Q$: radiant heat flux in kW/m²
- $\Phi$: view factor related to the dimensions and location of the source
- $\varepsilon$: emissivity of flame
- $\sigma$: Stefan-Boltzmann constant = $5.67.10^{-11} kW.m^{-2}.K^{-4}$
- $T$: absolute temperature of the radiating object (K). Assumed to be 1040°C (max compartment T° equating to radiation intensity of 168kW/m²).
