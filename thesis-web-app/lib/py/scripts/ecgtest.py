import sys
import json
import math
import numpy as np
import matplotlib.pyplot as plt


np.seterr(divide='ignore', invalid='ignore')
figNum = 1

def readTimeValuePairs(filePath, skip=0):
    # print(f"Read - Path: {filePath}")
    f = open(filePath)
    count, times, values = 0, [], []

    for line in f:
        if count < skip:
            count += 1
            continue
        t, v = [int(x) for x in line.strip().split(',')]
        times.append(t)
        values.append(v)
        count += 1

    count -= skip
    f.close()
    npTimes, npValues = np.array(times), np.array(values)
    return [count, npTimes, npValues]

if len(sys.argv) > 1:
    # print("Py Process - ECG - Node")
    # print("--------------------------------------------------")

    # Parse Config Arguments
    config = json.loads(sys.argv[1])
    title = config['title']
    rawDataPath = config["rawDataPath"]
    dataFiles = config['dataFiles']
    pyResultsPath = config['pyResultsPath']
    figureNames = config['figureNames']
    figureType = config['figureType']
    duration = int(config['duration'])

    # print(f"Config - DataPath: {rawDataPath}")
    # for key, val in config.items():
    # print(f"Config - {key}: {val}")

    # print("--------------------------------------------------")
    # Read input data
    ECG, PPG = 0, 1
    # print("Read - ECG")
    ecgPath = f"{rawDataPath}/{dataFiles[ECG]}"
    ecgCount, ecgTimes, ecgValues = readTimeValuePairs(ecgPath)
    # print(f"Read - ECG - Count: {ecgCount}")

    # print("--------------------------------------------------")
    # ------------------------------------------------------------------
    # ECG Input Signal
    # print("Plotting - ECG Input Signal ")
    plt.figure(figNum, figsize=(10, 6))
    plt.title("ECG Input Signal")
    plt.ylabel("ADC Value")
    plt.xlabel("Time (s)")
    plt.plot(ecgTimes, ecgValues)
    plt.ticklabel_format(style='sci', axis='x', scilimits=(0, 0))
    # ------------------------------------------------------------------
    # Saving Figure
    figureFilename = f"{pyResultsPath}/{figureNames[0]}.{figureType}"
    # print(f"Saving Figure - {figureFilename}")
    plt.tight_layout()
    plt.savefig(figureFilename, format="svg", bbox_inches='tight')
    # ------------------------------------------------------------------

# print("\n##################################################\n")
exit()
