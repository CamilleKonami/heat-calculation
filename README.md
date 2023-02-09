# heat-calculation
## Performance-based approach for cooker location in flats

This tool calculates the distance at which is received a specific radiant heat flux.

### Why?
As a best practice, it is recommended to provide a separation distance of 1.8m between kitchen hob and internal escape routes within bedrooms/flats.
However, due to space constraints, it may not be possible to achieve this safe distance of 1.8m between. This tool determines:
- what is the minimum distance from fire to maintain a given tenability criteria
- what is the total radiation FED received during evacuation.

### Fire scenario and assumptions

Fire is considered as a radiating panel, located above the cooking facilities (oven/hob). The bottom edge of the panel is assumed to be 0.9m above finished floor level (typical kitchen unit height), with a width of "**a**"m (kitchen unit width) and a height of "**b**"m (flame height).

Sprinklers are not considered when determining the **radiant heat from fire $\dot{Q}$**, as the temperature of the heat source is assumed to be the maximum compartment temperature noted in BR 187, equating to a radiation intensity value of 168 kW/m².

The determination of **FED**, on the other hand, takes into account the sprinkler effects, as the convective heat from the fire is not accounted for (sprinklers are expected to cool fire gas).

### Acceptance criteria

***Exposure to heat radiation:*** The acceptance criteria used within this analysis are based on the tenability limits for exposure of skin to radiant heat from PD 7974-6 Table I.4:
- A threshold heat flux of 2.5kW/m² can be tolerated by a person for 30 seconds 
- A threshold heat flux of 10kW/m² can be tolerated by a person for 4 seconds 

***FED:*** The cumulated heat doses, received during evacuation from the room, will trigger skin pain when it reaches FED = 1. To allow for uncertainties in response of more sensitive occupants to skin pain, this tenability limit may be reduced to 0.5 (elderly people, children).

### Determine distance from fire for a given radiant heat flux

The **radiant heat flux $\dot{Q}$** from a flame is given in PD 7974-1, by:
$$\dot{Q}=\Phi.\varepsilon.\sigma.T^4$$
Where:
- $\dot{Q}$: radiant heat flux in kW/m²
- $\Phi$: view factor related to the dimensions and location of the source
- $\varepsilon$: emissivity of flame
- $\sigma$: Stefan-Boltzmann constant = $5.67.10^{-11} kW.m^{-2}.K^{-4}$
- $T$: absolute temperature of the radiating object (K). Assumed to be 1040°C (max compartment T° equating to radiation intensity of 168kW/m²).

The **emissivity of the flame** $\varepsilon$ is given in BS EN 1991-1-2 and BR 187 by:
$$\varepsilon=1-exp(-0.3d)$$
Where:
-  $d$ is the flame thickness (corresponding to width of radiating panel)

**Calculation of the view factor F :**
the flame is approximated to be a rectangle shape for a parallel plane to a point. From equation noted in SFPE Handbook for Fire Protection Engineering 5th Edition Figure A-2:

![Picture1](https://user-images.githubusercontent.com/24531246/217807536-536a3a4a-31a3-4ba2-a102-d07e6b319c4a.jpg)

$$\Phi=\frac{1}{2\pi}\left[\frac{X}{\sqrt{1+X^2}}.\tan^{-1}\left(\frac{Y}{\sqrt{1+X^2}}\right)+\frac{Y}{\sqrt{1+Y^2}}.\tan^{-1}\left(\frac{X}{\sqrt{1+Y^2}}\right)\right]$$


$$X=\frac{a}{2c}$$
$$Y=\frac{b}{2c}$$
Where:
- $a$: width of fire/kitchen hob (m)
- $b$: height of fire/flame (m)
- $c$: distance from fire (m)

The distance from fire "c" is determined by solving : $\dot{Q}$ - tenability criteria = 0

### Calculation of FED along escape route
The Tolerance time $t_{tolrad}$ (s) is given by: 

