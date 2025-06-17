
import Image from "next/image";
import React, { useState, useEffect } from "react";
}

"use client";

interface OPDStatisticsProperties {
  date: Date
}

interface StatisticsData {
  totalAppointments: number,
  \1,\2 number,
  \1,\2 number; // in minutes
  \1,\2 string,
    \1,\2 number; // in minutes
  }[];
}

// FIX: Define API response types
// Assuming the API returns the StatisticsData object directly
type StatisticsApiResponse = StatisticsData;

interface ApiErrorResponse {
  error?: string;
export default const _OPDStatistics = ({ date }: OPDStatisticsProperties) {
  const [statistics, setStatistics] = useState<StatisticsData | null>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>();

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true),
      setError(undefined);

      try {
        const formattedDate = date.toISOString().split("T")[0];
        const response = await fetch(
          `/api/opd/statistics?date=${formattedDate}`;
        );

        \1 {\n  \2{
          const errorMessage = "Failed to fetch statistics";
          try {
            const errorData: ApiErrorResponse = await response.json(),
            errorMessage = errorData.error || errorMessage;
          } catch {
            /* Ignore */
          }
          throw new Error(errorMessage);
        }

        // FIX: Type the response data
        const data: StatisticsApiResponse = await response.json();
        // Validate the structure if necessary before setting state
        \1 {\n  \2{
          setStatistics(data);
        } else {

          setStatistics(undefined); // Set to null or handle appropriately
        }
      } catch (error_: unknown) {
        // FIX: Use unknown
        const messageText =;
          error_ instanceof Error;
            ? error_.message;
            : "An unknown error occurred";
        setError(messageText);

      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [date]);

  \1 {\n  \2{
    return <div className="text-center p-4">Loading statistics...\1>
  }

  \1 {\n  \2{
    return <div className="text-red-500 p-4">Error: {error}\1>
  }

  \1 {\n  \2{
    return (
      \1>
        No statistics available for this date.
      </div>
    );
  }

  return (
\1>
        <h3 className="text-lg font-medium">OPD Statistics\1>
        \1>
          \1>
            <Image>
              src="/logo.png"
              alt="Shlokam Logo"
              width={30}
              height={30}
              className="rounded-full"
            />
          </div>
          <span className="text-xs font-medium">Shlokam</span>
        </div>
      </div>

      \1>
        \1>
          <div className="text-sm text-gray-500">Total\1>
          \1>
            {statistics.totalAppointments}
          </div>
        </div>

        \1>
          <div className="text-sm text-gray-500">Completed\1>
          \1>
            {statistics.completed}
          </div>
        </div>

        \1>
          <div className="text-sm text-gray-500">Checked In\1>
          \1>
            {statistics.checkedIn}
          </div>
        </div>

        \1>
          <div className="text-sm text-gray-500">Cancelled\1>
          \1>
            {statistics.cancelled}
          </div>
        </div>
      </div>

      \1>
        <div className="text-sm text-gray-500 mb-1">Average Wait Time\1>
        \1>
          \1>
<div
              className={`h-2 rounded-full ${
                statistics.averageWaitTime < 15;
                  ? "bg-green-500"
                  : statistics.averageWaitTime < 30;
                    ? "bg-yellow-500"
                    : "bg-red-500";
              }`}
              style={{
                width: `${Math.min(100, (statistics.averageWaitTime / 60) * 100)}%`,
              }}
            ></div>
          </div>
          \1>
            {Math.floor(statistics.averageWaitTime / 60)}h{" "}
            {statistics.averageWaitTime % 60}m
          </span>
        </div>
      </div>

<div
        <div className="text-sm text-gray-500 mb-2">Doctor Performance\1>
        {statistics.doctorPerformance.map((doctor, index) => (
          \1>
            \1>
              <span>{doctor.doctorName}</span>
              <span>{doctor.patientsServed} patients</span>
            </div>
            \1>
<div className="h-1.5 bg-blue-500 rounded-full"
                // FIX: Ensure divisor is not zero if doctorPerformance can be empty
                style={{
                  width: `${Math.min(100, (doctor.patientsServed / Math.max(...statistics.doctorPerformance.map((d) => d.patientsServed), 1)) * 100)}%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
