Design Studio Feedback from April 14
===
Peers giving feedback: Lyla Fadden, Micah Lanier

## Peer Comments:
- The labeling on our slider allowing the user to selected the amount of snowfall is not as straightforward as we thought it to be.

- We planned on linking the icons of the stations on our map to reflect the amount of ridership for a given amount of snowfall. 
After our peers saw what the rendering of the map looked like, they thought that the icons would be too small to encode any information
using concentric circles and their relative areas. 

- Our axes could use clearer labeling (ie. include a 'Rider Entries' label to be more specific)

- We should consider how the MBTA map will react on mouseover, whether we will incorporate persistent selection

## Addressing the Comments:
- Currently our slider displays the amount of snowfall within each selected bin and has a snowflake icon that the user drags in order to 
select. Even so, it's a little unclear whether the slider denotes inches of snow, number of days with snowfall, etc. We will include a 
small label like 'Inches of Snowfall' to help clarify this.

- We want the MBTA map to reflect which stations are equally affected by snowfall as the user-selected station of reference. The concentric
circles idea may not be the best choice so one option that we are considering is placing a bold outline (or a snowflake, to keep the theme 
going) being the icons for any stations that lose a similar amount of ridership for the given amount of snow. For example, the user selects
0-2 inches of snowfall and Kenmore as the station of interested. Kenmore may maintain 90% of its normal ridership for 0-2 inches of snow
while Park St. and Harvard Square stations maintain 91% and 89% of ridership, respectively. The icons for those stations on the map would
now be outlined (or otherwise identified, to be explained in a legend on the map) to show they behave similarly for the selected criteria.

- We will be sure to be explicit in our labeling of the axes.

- The ridership plot will change according to which station the user clicks on in the MBTA map view. The MBTA map view would be a little cluttered
if we included the names of each station by default so we are considering flashing the name of the station the user is currently hovering
over. Hovering over will not change which station is selected but will help orient the user while navigating the map.

## Our comments on the feedback:

- We believe that the feedback received from the other group was very worthwhile. We've scrutinized over many of the design decisions and have practiced
telling the story we want to convey amongst ourselves, but having this other group play around with our prototype website definitely highlighted areas
that we overlooked. One of the most important things we took away from both this design studio and the meeting with Benjy, our TF, was that our design
decisions and the scope of user-control heavily depend on our intended audience. This design studio has definitely helped us reconsider some of the more
nuanced aspects of our implementation, and we think that this will ultimately lead to a more polished and engaging user experience.