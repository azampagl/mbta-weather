% output format - JSON
%  Station
%       name : nameVal
%       connections : {
%           'red' : {connectedStationName1, connectedStationName2}
%           'orange' : {connectedStationName1, connectedStationName2}
%       }


nameCol = 1;
lineCol = 2;
xCol = 3;
yCol = 4;
edgeStartCol = 5;


haveErr = false;

% read in the excel file
[~,~, raw] = xlsread('station_graph.xls');
names = strtrim({raw{2:end,nameCol}});
stations.names = unique(names);

numStations = size(raw,1)-1;  % minus 1 for the header
headerOffset = 1;

for(i=1:length(stations.names))
    stationIdx = find(strcmpi(stations.names{i}, strtrim(names)));
    stations.x(i) = raw{headerOffset+stationIdx(1), xCol};
    stations.y(i) = raw{headerOffset+stationIdx(1), yCol};
    for(j = 2:length(stationIdx))
        % check to make sure x,y is same for all entries of the same station
        if(raw{headerOffset+stationIdx(j), xCol} ~= stations.x(i) || raw{headerOffset+stationIdx(j), yCol} ~= stations.y(i))
            error(['x,y coordinates do not match for all entries of ' stations.names{i}]);
        end
    end
end

% check to make sure all edges refer to a valid station
for(i=1:numStations)
    rawConnections = {raw{headerOffset+i, edgeStartCol:end}};
    connections = {};
    for(j=1:length(rawConnections))
        if(~isnan(rawConnections{j}))
            connections{length(connections)+1} = rawConnections{j};
        end
    end
    for(j=1:length(connections))
        if(sum(strcmpi(connections{j}, stations.names)) == 0)
            error([connections{j} 'is not in the station name list']);
        end
    end
end

%% create the json data struct that represents the subway map graph
fid = fopen('station_map.json',w);

fprintf(fid, '[\n');



fprintf(fid, ']');

fclose(fid);

